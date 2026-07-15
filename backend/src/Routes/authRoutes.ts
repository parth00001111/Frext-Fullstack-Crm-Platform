import { Router } from "express";
import { signin, signup, logout } from "../Controllers/userController.ts";
import { verifyToken } from "../Middleware/authMiddleware.ts";

const authRouter = Router();

authRouter.post("/signup", signup) 
authRouter.post("/signin", signin);
authRouter.get("/logout", verifyToken, logout);
export default authRouter;