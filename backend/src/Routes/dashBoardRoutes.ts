import getDashBoard from "../Controllers/dashBoard.ts";
import authorize from "../Middleware/roleMiddleware.ts";
import { verifyToken } from "./../Middleware/authMiddleware.ts";
import { Router } from "express";

const dashBoardRouter = Router();

dashBoardRouter.get("/dashBoard", verifyToken, authorize("Admin", "Manager", "Sales"), getDashBoard);

export default dashBoardRouter;