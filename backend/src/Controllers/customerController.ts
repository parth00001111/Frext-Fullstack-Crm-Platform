import  { type IJwtPayload } from './../Middleware/authMiddleware';
import customerModel from "../Models/customerModel.ts";
import { type RequestHandler, type Request, type Response } from "express";
import customerSchema from "../Validation/customerValidation.ts"

interface IResponse {
    success: boolean, 
    message: string,
    value?: any 
}

const createCustomer: RequestHandler = async(req: Request, res: Response) => {
    console.log("create customer hit ho gya hai")
    const { success, error, data } = customerSchema.safeParse(req.body);
    if(!success) {
        return res.json({
            success: false,
            message: "something's wrong in createCustomer",
            value: null
        } as IResponse)
    }
    try {
        const { name, email, phone, company, status } = data;
       const newCustomer = await customerModel.create({
        name, 
        email, 
        phone, 
        company, 
        status,
        assignedTo: req.user!.id,
       })

        const populatedCustomer = await newCustomer.populate("assignedTo", "name");
        res.status(201).json({
            success: true, 
            message: "Customer Created Successfully", 
            value: {
                ...populatedCustomer.toObject(),
                assignedTo: (populatedCustomer.assignedTo as any).name
            } 
        } as IResponse);


    }catch(e: any) {
        console.log("error" + e.message);
        res.status(500).json({
            success: false, 
            message: e.message,
            value: null
        } as IResponse)
    }
}

const getAllCustomers: RequestHandler = async(req: Request, res: Response) => {
    console.log("Get all customer hit ho gya")
    const allCustomers = await customerModel.find();
    res.status(200).json({
        success: true, 
        message: "List of all the customers", 
        data: allCustomers
    } as IResponse)

}

const getCustomersById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id){
        res.status(404).json({
            success: false, 
            message: "Something's wrong with your id",
            value: null
        } as IResponse)
    }
    try {
        
        const findId = await customerModel.findById(id);
        if(!findId) {
            res.status(404).json({
                success: false, 
                message: "Provided id does not exists", 
                value: null
            } as IResponse)
        }
        res.status(200).json({
            success: true, 
            message: "customer with id" + findId, 
            value: findId
        })


    }catch(e: any) {
        console.log("error: ", e.message);
        res.status(500).json({
            success: false, 
            message: e.message,
            value: null
        } as IResponse)
    }

}

const updateCustomers: RequestHandler = async(req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) { 
        res.status(404).json({
            success: false, 
            message: "Enter id properly",
            value: null
        } as IResponse)
    }
    try {
        const { name, email, phone, company, status } = req.body
        const findCustomer = await customerModel.findByIdAndUpdate(
            id, 
            {
                $set: {
                    ...(name !== undefined ? { name } : {}), 
                    ...(email !== undefined ? { email }: {}),
                    ...(phone!== undefined ? { phone }: {}),
                    ...(company !== undefined ? { company }: {}),
                    ...(status !== undefined ? { status }: {}),

                }
            }, {
                new: true
            }
        )
        if(!findCustomer) {
            res.status(404).json({
                success: false, 
                message: "Customer does not found", 
                value: null
            } as IResponse)
        }
        res.status(201).json({
            success: true, 
            message: "Customer update successfully", 
            value: findCustomer,
        } as IResponse)
    }catch(e: any){
        console.log("Error: ", e.message);
        res.status(500).json({
            success: false, 
            message: e.message,
            value: null
        } as IResponse)
    }
}

const deleteCustomers: RequestHandler = async(req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) {
        res.status(404).json({
            success: false, 
            message: "Enter id properly", 
            value: null
        } as IResponse)
    }
    try {
        await customerModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true, 
            message: "customer Deleted Successfully",
        })
    }catch(e: any) {
        console.log("error: ", e.message);
        res.status(500).json({
            success: false, 
            message: e.message, 
            value: null
        } as IResponse)
    }

}

export { createCustomer, getAllCustomers, getCustomersById, updateCustomers, deleteCustomers };