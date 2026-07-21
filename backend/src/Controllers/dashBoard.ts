import { type IResponse } from './../Response';
import { type RequestHandler, type Request, type Response } from 'express';
import { userModel } from "../Models/userModel.ts"
import customerModel from "../Models/customerModel.ts"; 
import dealsModel from "../Models/dealsModel.ts"
import taskModel from "../Models/tasksModel.ts";
import { success } from 'zod';


const getDashBoard: RequestHandler = async (req: Request, res: Response) => {
    try {

        const totalUsers = await userModel.countDocuments()
        
        const totalCustomers = await customerModel.countDocuments()
        
        const totalDeals = await dealsModel.countDocuments()
        
        const totalTasks = await taskModel.countDocuments()
        
        const wonDeals = await dealsModel.countDocuments({
            stage: "Won"
        })
        
        const lostDeals = await dealsModel.countDocuments({
            stage: "Lost", 
        })
        
        const pendingTask = await taskModel.countDocuments({
            status: "Pending", 
        })
       
        const completedTask = await taskModel.countDocuments({
            status: "Completed", 
        })

        res.status(200).json({
            
            success: true, 
            message: "Dashboard fetched successfully", 
            value: {

                totalUsers, 
                
                totalCustomers,
                
                totalDeals,
                
                totalTasks,
                
                wonDeals,
                
                lostDeals,
                
                pendingTask,
                
                completedTask
            }
        })
    
    }catch(e: any){
       
        console.log("error", e.message)
       
        return res.status(500).json({
       
            success: false, 
            message: e.message, 
            value: null
        } as IResponse)
    }
    
}
export default getDashBoard