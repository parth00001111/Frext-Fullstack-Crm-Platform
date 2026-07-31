import { type RequestHandler, type Request, type Response } from "express";
import activityLogModel from "../models/activityModel.ts";

interface IResponse {
    success: boolean,
    message: string,
    value?: any
}

const getAllActivities: RequestHandler = async (req: Request, res: Response) => {
    try {
        const allActivities = await activityLogModel
            .find()
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "List of all activities",
            value: allActivities
        } as IResponse);

    } catch (e: any) {
        console.log("error: " + e.message);
        res.status(500).json({
            success: false,
            message: e.message,
            value: null
        } as IResponse);
    }
}

const getActivityByEntity: RequestHandler = async (req: Request, res: Response) => {
    const { entityType, entityId } = req.params;

    if (!entityType || !entityId) {
        return res.status(404).json({
            success: false,
            message: "Something's wrong with entityType or entityId",
            value: null
        } as IResponse);
    }

    try {
        const activities = await activityLogModel
            .find({ entityType, entityId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Activity for entity",
            value: activities
        } as IResponse);

    } catch (e: any) {
        console.log("error: ", e.message);
        res.status(500).json({
            success: false,
            message: e.message,
            value: null
        } as IResponse);
    }
}

export { getAllActivities, getActivityByEntity };
