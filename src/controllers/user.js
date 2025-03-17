
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../client.js';
import nodemailer from 'nodemailer';
import moment from 'moment';




const generateToken = async (user) => {
    return jwt.sign(
        {
            uuid: user.uuid
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d",
        }
    );
};


export const sendMail = async (to, subject, text = null, html = null) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });


        await transporter.sendMail({
            from: `"Volunteer Link" <${process.env.SMTP_USERNAME}>`, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html, // html body
        })
    } catch (error) {
        console.log(error)
    }
}

const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
}


export const resendOTP = async (req, res) => {
    try {
        var { email } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                address: true
            }
        });

        if (!user) return res.status(404).json({ status: false, message: "User not found" });
        await sendOTP(user);
        return res.status(200).json({
            status: true,
            message: "OTP Sent Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(422).json({
            status: false,
            message: error.message
        })
    }
}

export const sendOTP = async (user) => {
    try {
        var value = Math.floor(1000 + Math.random() * 9000);
        await prisma.oTP.create({
            data: {
                user: {
                    connect: {
                        id: user.id
                    }
                },
                value: String(value),
                expireAt: addMinutes(new Date, 10)
            }
        });
        await sendMail(user.email, "OTP for VolunteerLink", `Your Volunteer Link OTP is ${value}`);
    } catch (error) {
        console.log(error)
    }
}

export const verifyOtp = async (req, res) => {
    try {
        var { email, otp } = req.body;
        var otpObj = await prisma.oTP.findFirst({
            where: {
                value: otp,
                user: {
                    email: email
                },
                expireAt: {
                    gte: new Date()
                }
            },
            include: {
                user: true
            }
        });
        if (!otpObj) return res.status(422).json({
            status: false,
            message: "Invalid OTP"
        });
        var token = await generateToken(otpObj.user);
        await prisma.oTP.deleteMany({
            where: {
                OR: [
                    {
                        id: otpObj.id
                    },
                    {
                        expireAt: {
                            lt: new Date()
                        }
                    }
                ]
            }
        })
        return res.status(200).json({ status: true, message: "OTP Verified Successfully", token });
    } catch (error) {
        console.log(error);
        return res.status(422).json({
            status: false,
            message: "Invalid OTP"
        })
    }
}

// Create a new user with hashed password
export const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        var existing = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (existing) {
            return res.status(422).json({
                status: false,
                message: "User Already Exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        await sendOTP(user);
        res.status(200).json({ message: "User created successfully", status: true });
    } catch (error) {
        res.status(422).json({ message: error.message, status: false });
    }
};

// Authenticate user (login)
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) return res.status(404).json({ status: false, message: "User not found" });
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ status: false, message: "Invalid credentials" });
        var token = await generateToken(user);
        res.status(200).json({ status: true, message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { address: true }
        });
        res.json(users);
    } catch (error) {
        res.status(422).json({ error: error.message });
    }
};

// Get a single user by UUID
export const getUser = async (req, res) => {
    try {
        res.json({ status: true, user: req.user });
    } catch (error) {
        res.status(422).json({ error: error.message, status: false });
    }
};

// Update user by UUID
export const updateUser = async (req, res) => {
    try {
        const { first, last, dob, gender , phone, additionalInfo} = req.body;
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { first, last, dob: moment(dob, "DD/MM/YYYY").startOf('D').toDate(), gender , phone , additionalInfo : {...req.user.additonalInfo , ...additionalInfo}}
        });
        // if (address)
        // {
        //     await prisma.address.upsert({
        //         where : {
        //             user : {
        //                 id : req.user.id
        //             }
        //         },
        //         update : {
        //             ...address
        //         }
        //     })
        // }
        delete user.id;
        delete user.password;
        res.json(user);
    } catch (error) {
        res.status(422).json({ message: error.message, status : false });
    }
};

export const setPassword = async (req, res) => {
    try {
        const { password} = req.body;
        if (!password || password.length < 3)
        {
            return res.status(422).json({
                status : false,
                message : "Enter a valid password!"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { password : hashedPassword }
        });
        res.json({
            status : true,
            message : "Password successfully set!"
        });
    } catch (error) {
        res.status(422).json({ message : error.message, status : false });
    }
};



// Delete user by UUID
export const deleteAccount = async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id : req.user.id }
        });

        res.json({ message: "User account deleted successfully!" , status : true});
    } catch (error) {
        res.status(422).json({ error: error.message , status : false});
    }
};
