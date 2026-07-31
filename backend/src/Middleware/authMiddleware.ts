import { type Request, type Response, type NextFunction, type RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface IResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface IJwtPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.header("Authorization");

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(400).json({
      success: false,
      message: "Something's wrong in Auth Headers",
      data: null,
    } as IResponse);
  }

  const token = authHeaders.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is missing",
      data: null,
    } as IResponse);
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "JWT secret is not configured",
      data: null,
    } as IResponse);
  }

  try {
    const decode = jwt.verify(token, secret) as unknown as IJwtPayload
    req.user = decode;
    next();
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Invalid token";
    console.log("error: " + message);
    res.status(401).json({
      success: false,
      message,
      data: null,
    } as IResponse);
  }
};