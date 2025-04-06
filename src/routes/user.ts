import express from "express";
import { Request, Response } from "express";
import z from "zod";
import { User } from "../db";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const userRouter = express.Router();

const signupBody = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
});

userRouter.post("/signup", async (req: Request, res: Response) => { // error: async (req: Request, res: Response) => {
    const { success, data } = signupBody.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            message: "Invalid input data!"
        });
    }

    const existingUser = await User.findOne({
        username: data.username
    });

    if (existingUser) {
        return res.status(409).json({
            message: "Username already exists!"
        });
    }

    // 🛠️ Create new user (add password hashing in real apps)
    const newUser = new User({
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { // error: JWT_SECRET
        expiresIn: "1h",
    });

    return res.status(201).json({
        message: "User created successfully!",
        token,
    });
});

export default userRouter;