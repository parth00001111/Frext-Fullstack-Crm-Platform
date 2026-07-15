import customerModel from "../Models/customerModel.ts";
import { RequestHandler, type Request, type Response } from "express";
import customerSchema from "../Validation/customerValidation.ts";

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
            name, email, phone, company, status, assignedTo: req.user?.id
        })
        res.status(201).json({
            success: true, 
            message: "Customer Created Successfully", 
            value: newCustomer,
        })


    }catch(e: any) {
        console.log("error" + e.message);
        res.status(500).json({
            success: false, 
            message: e.message,
            value: null
        } as IResponse)
    }
}

const getAllCustomers: RequestHandler = (req: Request, res: Response) => {

}

const getCustomersById: RequestHandler = (req: Request, res: Response) => {

}

const updateCustomers: RequestHandler = (req: Request, res: Response) => {

}

const deleteCustomers: RequestHandler = (req: Request, res: Response) => {

}

export { createCustomer, getAllCustomers, getCustomersById, updateCustomers, deleteCustomers };