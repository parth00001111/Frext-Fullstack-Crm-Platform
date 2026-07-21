import { type IJwtPayload } from './../Middleware/authMiddleware';
import { type IResponse } from "../Response.ts"; 
import dealSchema from "../Validation/dealValidation.ts"; 
import dealModel from "../Models/dealsModel.ts";
import { type RequestHandler, type Request, type Response } from "express"; 
import customerModel from '../Models/customerModel.ts';


const createDeal: RequestHandler = async (req: Request, res: Response) => {
    const { success, error, data } = dealSchema.safeParse(req.body);
    if(!success){
        return res.status(401).json({
            success: false, 
            message: "Enter credentials properly",
            value: null
        } as IResponse)
    }
    try {
        const { title, value, stage, customerId } = data;
        if(!title || !value || !stage || !customerId) {
            return res.status(400).json({
                success: false, 
                message: "Somethings wrong in credentials", 
                data: null
            } as IResponse)
        }
        const findCustomerId = await customerModel.findById(customerId)
       
        if(!findCustomerId) {
            return res.status(404).json({
                success: false, 
                message: "Customer does not found", 
                value: null
            } as IResponse)
        }
        
        const newDeal = await dealModel.create({
            title, value, stage, customerId, assignedTo: req.user!.id,
        })
        
        const populateDeal = await newDeal.populate("assignedTo", "name");
        res.status(201).json({
            
            success: true, 
            message: "Deal created Successfully",
            value: {
                ...populateDeal.toObject(),
                assignedTo: (populateDeal.assignedTo as any).name
            }
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

const getAllDeal: RequestHandler = async(req: Request, res: Response)=> {

    try {

        const allDeals = await dealModel.find();
        res.json({
            success: true, 
            message: "List of all deals", 
            value: allDeals
        } as IResponse)

    }catch(e: any) {
        console.log("error"+ e.message);
        return res.status(500).json({
            success: false, 
            message: e.message,
            value: null,
        }as IResponse)
    }
}

const getDealById: RequestHandler = async(req: Request, res: Response)=> {
    console.log("getDeal by id hit ho gya")
    const { id } = req.params;
    if(!id) {
        return res.status(401).json({
            success: false, 
            message: "Something's wrong with id", 
            value: null
        } as IResponse)
    }
    try {

        const findId = await dealModel.findById(id);
        
        if(!findId) {
            return res.status(404).json({
                success: false, 
                message: "Id not found", 
                value: null
            } as IResponse)
        }

        res.status(200).json({
            success: true, 
            message: "found the deal with id", 
            value: findId
        } as IResponse)

    }catch(e: any) {
        console.log("error: ", e.message);
        return res.status(500).json({
            success: false, 
            message: e.message, 
            value: e.message
        } as IResponse)
    }
}

const updateDeal: RequestHandler = async(req: Request, res: Response) =>{
    const { id } = req.params;

    if(!id) {
        return res.status(401).json({
            success: false, 
            message: "something's wrong with Id", 
            value: null
        } as IResponse)
    }


    try {
        const { title, value, stage } = req.body;

        const updateDeals = await dealModel.findByIdAndUpdate(
            id, 
            {
                $set: {
                    ...(title !== undefined ? { title } : {}),
                    ...(value !== undefined ? { value } : {}),
                    ...(stage !== undefined ? { stage } : {}),
                }
            },{
                new: true
            }
        )
        
        res.status(200).json({
            success: true, 
            message: "Deal updated successfully", 
            value: updateDeals
        } as IResponse)
        
    }catch(e: any) {
        console.log("error: "+ e.message);
        return res.status(500).json({
            success: false,
            message: e.message,
            value: null
        } as IResponse)
    }
}

const deleteDeal: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("Deleting deal with id:", id);

    if (!id) {
        return res.status(401).json({
            success: false, 
            message: "something's wrong with Id", 
            value: null
        } as IResponse);
    }

    try {
        const deleted = await dealModel.findByIdAndDelete(id);
        console.log("Deleted result:", deleted);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Deal not found",
                value: null
            } as IResponse);
        }

        return res.status(200).json({
            success: true, 
            message: "Deal deleted successfully",
            value: deleted
        } as IResponse);

    } catch (e: any) {
        console.log("error: ", e.message);
        return res.status(500).json({
            success: false, 
            message: e.message, 
        } as IResponse);
    }
}

export { createDeal, getAllDeal, getDealById, updateDeal, deleteDeal };