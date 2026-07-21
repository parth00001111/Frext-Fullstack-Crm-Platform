import { signupSchema, signinSchema } from "../Validation/userValidation.ts";
import { userModel, type IUser } from "../Models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { type Request, type Response } from "express";
import { type RequestHandler } from "express";

dotenv.config();

interface IResponse {
    success: boolean;
    message: string;
    value?: any;
}


const signup: RequestHandler = async (req: Request, res: Response) => {
    console.log("came to signup");

    const { success, error, data } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            value: error?.format() || null
        } as IResponse);
    }

    try {
        const { name, email, password, role } = data;

        const existUser = await userModel.findOne({ email });
        if (existUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
                value: null
            } as IResponse);
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const createUser = await userModel.create({
            name,
            email,
            password: hashPassword,
            role: role 
        });



        res.status(201).json({
            success: true,
            message: "User created successfully",
            value: createUser,
        } as IResponse);

    } catch (e: any) {
        console.error("Signup Error:", e.message);
        return res.status(500).json({
            success: false,
            message: e.message || "Internal server error",
            value: null
        } as IResponse);
    }
};


const signin: RequestHandler = async (req: Request, res: Response) => {
    console.log("came to sign in")
    const { success, data } = signinSchema.safeParse(req.body);


    if (!success) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            value: null
        } as IResponse);
    }

    try {
        const { email, password } = data;


        const user = await userModel.findOne({ email }).select("+password") as IUser | null;

        if (!user || !user.password) {
            return res.status(404).json({
                success: false,
                message: "User does not exist. Please signup first",
                value: null
            } as IResponse);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password does not match",
                value: null
            } as IResponse);
        }

      
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        return res.status(200).cookie("token", token).json({
            success: true,
            message: "Login successful",
            value: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        } as IResponse);

    } catch (e: any) {
        console.error("Signin Error:", e.message);
        return res.status(500).json({
            success: false,
            message: e.message || "Internal server error",
            value: null
        } as IResponse);
    }
};
const logout: RequestHandler = async (req: Request, res: Response) => {
    res.status(200).clearCookie("token").json({
        success: true, 
        message: "logout successfully", 
        data: null
    } as IResponse)
}

export { signup, signin, logout };