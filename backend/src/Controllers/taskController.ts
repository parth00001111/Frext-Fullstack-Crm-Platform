import { IResponse } from './../Response';
import { RequestHandler, type Request, type Response } from 'express';
import { IJwtPayload } from './../Middleware/authMiddleware';
import schemaTask from "../Validation/taskValidation.ts";
import taskModel from "../Models/tasksModel.ts";
import { success } from 'zod';

const createTask: RequestHandler = async(req: Request, res: Response) => {
    console.log("create task hit ho gya")
    const { success, error, data } = schemaTask.safeParse(req.body);
    
    if(!success) {
        return res.status(401).json({
            success: false, 
            message: "Something's wrong with credentials",
            value: null,
        } as IResponse)
    }

    try {
        const { title, dueDate, status, customerId } = data;
        if(!title|| !dueDate || !status || !customerId) {
            return res.status(409).json({
                success: false, 
                message: "Enter credentials properly",
                value: null,
            } as IResponse)
        }
        const newTask = await taskModel.create({
            title, 
            dueDate, 
            status, 
            customerId, 
            assignedTo:req.user!.id 
        })
        const populateTask = await newTask.populate("assignedTo", "name");
        res.status(201).json({
            success: false, 
            message: "Task created Successfully",
            value: {
                ...populateTask.toObject(),
                assignedTo: (populateTask.assignedTo as any).name
            }
        })


    }catch(e: any) {
        console.log("error", e.message); 
        return res.status(500).json({
            success: false, 
            message: e.message,
            value: null,
        } as IResponse)
    }
}
const getAllTasks: RequestHandler = async(req: Request, res: Response) => {
    
    try {

        const allTasks = await taskModel.find();
        
        if(!allTasks) {
            return res.status(404).json({
                success: false, 
                message: "There are no tasks yet",
                value: null
            } as IResponse)
        }
        
        res.status(200).json({
            success: true, 
            message: "all Tasks", 
            value: allTasks
        })
    }catch(e:any) {
        console.log("error: " + e.message); 
        return res.status(500).json({
            success: false, 
            message: e.message,
            value: null,
        } as IResponse)
    }

}
const getTasksById: RequestHandler = async(req: Request, res: Response) => {

    console.log("get task with id hit ho gya")
    const { id } = req.params;

    if (!id) {
        return res.status(409).json({
            success: false, 
            message: "Enter id properly", 
            value: null
        } as IResponse)
    }
    try {
        const findId = await taskModel.findById(id);
        if(!findId) {
            return res.status(404).json({
                success: false, 
                message: "Id not found", 
                value: null
            } as IResponse)
        }
        res.status(200).json({
            success: true, 
            message: "Task with Id", 
            value: findId,
        } as IResponse)

    }catch(e: any) {
        console.log("error: " + e.message); 
        return res.status(500).json({
            success: false, 
            message: e.message,
            value: null
        } as IResponse)
    }

}
const updateTasks: RequestHandler = async(req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(409).json({
            success: false, 
            message: "Enter id properly", 
            value: null
        } as IResponse)
    }


    try {
        const { title, dueDate, status } = req.body;
        const updateTask = await taskModel.findByIdAndUpdate(
            id, 
            {
                $set: {
                    ...(title !== undefined ? { title } : {}),
                    ...(dueDate !== undefined ? { dueDate } : {}),
                    ...(status !== undefined ? { status } : {}),
                }
            }, {
                returnDocument: "after", 
            } 
        )
        res.status(201).json({
            success: true,
            message: "Task updated successfully", 
            value: updateTask
        } as IResponse)


    }catch(e: any) {
        console.log("error: " + e.message);
        return res.status(500).json({
            success: false, 
            message: e.message,
            value: null
        } as IResponse)
    }

}
const deleteTasks: RequestHandler = async(req: Request, res: Response) => {
    
    const { id } = req.params;
     
    if (!id) {
        return res.status(409).json({
            success: false, 
            message: "Enter id properly", 
            value: null
        } as IResponse)
    }

    try {
        const deleted = await taskModel.findByIdAndDelete(id)
        
        if(!deleted) {
            return res.status(404).json({
                success: false, 
                message: "there is no task to delete", 
                value: null,
            } as IResponse)
        }
        res.status(200).json({
            success: true, 
            message: "task deleteSuccessfully", 
        })

    }catch(e: any) {
        console.log("error: " + e.message);
        return res.status(500).json({
            success: false, 
            message: e.message,
            value: null
        } as IResponse)
    }
}


export { createTask, getAllTasks, getTasksById, updateTasks, deleteTasks }