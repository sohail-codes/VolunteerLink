import prisma from "../client.js";
import jwt from 'jsonwebtoken';




export const authMiddleware = async (req, res, next) => {
    try {
        var token = req.headers.authorization.split(" ")[1];
        var decoded = jwt.verify(token, process.env.JWT_SECRET);

    
        if (decoded) {
            var user = await prisma.user.findFirstOrThrow({
                where: {
                    uuid: decoded.uuid
                },
                include : {
                    address : true
                }
            });
            if (user) {
                delete user.password;
                req.user = user;
                return next();
            }
        }
        return res.status(401).json({
            message: "Unauthorized",
            status: false,
        });
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Unauthorized",
            status: false,
        });
    }
};