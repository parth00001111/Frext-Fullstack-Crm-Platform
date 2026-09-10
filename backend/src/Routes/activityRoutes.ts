import { Router } from "express";
import { getAllActivities, getActivityByEntity } from "../Controllers/activityController.ts";
import { verifyToken } from "../Middleware/authMiddleware.ts";
import authorize from "../Middleware/roleMiddleware.ts";

const activityRouter = Router();

activityRouter.get("/getAllActivities", verifyToken, authorize("Admin", "Manager"), getAllActivities);

activityRouter.get("/getActivityByEntity/:entityType/:entityId", verifyToken, authorize("Admin", "Manager", "Sales"), getActivityByEntity);

export default activityRouter;
