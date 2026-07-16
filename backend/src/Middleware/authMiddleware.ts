import { type Request, type Response, type NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";
dotenv.config();

interface IResponse {
    success: boolean,
    message: string,
    data?: any
}
export interface IJwtPayload {
    id: string, 
    role: string,
}

declare global {
    namespace Express {
        interface Request {
            user?: IJwtPayload

        }
    }
}


export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const authHeaders = req.header('Authorization'); 
    
    if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        return res.status(400).json({
            success: false, 
            message: "something's wrong in Auth Headers",
            data: null
        } as IResponse);
        
    }

    const token = authHeaders?.split(' ')[1]; 

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET as string) as IJwtPayload;
        req.user = decode;
        next();
    } catch (e: any) {
        console.log("error: " + e.message);
        res.status(401).json({ 
            success: false, 
            message: e.message,
            data: null
        } as IResponse);
    }
}