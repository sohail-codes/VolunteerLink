
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../client.js';





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

// Create a new user with hashed password
export const createUser = async (req, res) => {
    try {
        const { first, last, email, password, avatar } = req.body;

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
                first,
                last,
                email,
                password: hashedPassword,
                avatar
            }
        });
       
        delete user.id;
        delete user.password;
        res.status(200).json({ message: "User created successfully", user, status: true });
    } catch (error) {
        res.status(422).json({ message: error.message, status: false });
    }
};

// Authenticate user (login)
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                address: true
            }

        });

        if (!user) return res.status(404).json({ error: "User not found" });
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
        var token = await generateToken(user);
        res.status(200).json({ status: true, message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
};

// Get a single user by UUID
export const getUser = async (req, res) => {
    try {
        res.json({status : true , user : req.user});
    } catch (error) {
        res.status(422).json({ error: error.message, status : false });
    }
};

// Update user by UUID
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { first, last, email, avatar } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { first, last, email, avatar }
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete user by UUID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id }
        });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
