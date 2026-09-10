import customerModel from "../Models/customerModel.ts";
import activityLogModel from "../Models/activityModel.ts";
import { type RequestHandler, type Request, type Response } from "express";
import customerSchema from "../Validation/customerValidation.ts";

interface IResponse {
  success: boolean;
  message: string;
  value?: any;
}

const createCustomer: RequestHandler = async (req: Request, res: Response) => {
  console.log("create customer hit ho gya hai");

  const { success, error, data } = customerSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      success: false,
      message: error?.issues?.[0]?.message || "Validation failed in createCustomer",
      value: null,
    } as IResponse);
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
    });

    // Activity log
    await activityLogModel.create({
      userId: req.user!.id,
      action: `created customer "${newCustomer.name}"`,
      entityType: "Customer",
      entityId: newCustomer._id,
    });

    // Populate assignedTo name
    const populatedCustomer = await newCustomer.populate("assignedTo", "name");

    const customerObj = populatedCustomer.toObject();

    res.status(201).json({
      success: true,
      message: "Customer Created Successfully",
      value: {
        ...customerObj,
        assignedTo: (populatedCustomer.assignedTo as any)?.name || null,
      },
    } as IResponse);
  } catch (e: any) {
    console.log("error →", e.message);

    // Duplicate key handling (email / phone unique)
    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern || {})[0] || "field";
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        value: null,
      } as IResponse);
    }

    res.status(500).json({
      success: false,
      message: e.message || "Internal Server Error",
      value: null,
    } as IResponse);
  }
};

const getAllCustomers: RequestHandler = async (req: Request, res: Response) => {
  console.log("Get all customer hit ho gya");

  try {
    const allCustomers = await customerModel
      .find()
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    const formatted = allCustomers.map((c) => {
      const obj = c.toObject();
      return {
        ...obj,
        assignedTo: (c.assignedTo as any)?.name || null,
      };
    });

    res.status(200).json({
      success: true,
      message: "List of all the customers",
      value: formatted,
    } as IResponse);
  } catch (e: any) {
    console.log("error:", e.message);
    res.status(500).json({
      success: false,
      message: e.message,
      value: null,
    } as IResponse);
  }
};

const getCustomersById: RequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Customer ID is required",
      value: null,
    } as IResponse);
  }

  try {
    const customer = await customerModel
      .findById(id)
      .populate("assignedTo", "name");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        value: null,
      } as IResponse);
    }

    const customerObj = customer.toObject();

    res.status(200).json({
      success: true,
      message: `Customer with id ${customer._id}`,
      value: {
        ...customerObj,
        assignedTo: (customer.assignedTo as any)?.name || null,
      },
    } as IResponse);
  } catch (e: any) {
    console.log("error:", e.message);
    res.status(500).json({
      success: false,
      message: e.message,
      value: null,
    } as IResponse);
  }
};

const updateCustomers: RequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Customer ID is required",
      value: null,
    } as IResponse);
  }

  try {
    const { name, email, phone, company, status } = req.body;

    const updatedCustomer = await customerModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...(name !== undefined && { name }),
            ...(email !== undefined && { email }),
            ...(phone !== undefined && { phone }),
            ...(company !== undefined && { company }),
            ...(status !== undefined && { status }),
          },
        },
        { new: true, runValidators: true }
      )
      .populate("assignedTo", "name");

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        value: null,
      } as IResponse);
    }

    // Activity log
    await activityLogModel.create({
      userId: req.user!.id,
      action: `updated customer "${updatedCustomer.name}"`,
      entityType: "Customer",
      entityId: updatedCustomer._id,
    });

    const customerObj = updatedCustomer.toObject();

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      value: {
        ...customerObj,
        assignedTo: (updatedCustomer.assignedTo as any)?.name || null,
      },
    } as IResponse);
  } catch (e: any) {
    console.log("Error:", e.message);

    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern || {})[0] || "field";
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        value: null,
      } as IResponse);
    }

    res.status(500).json({
      success: false,
      message: e.message,
      value: null,
    } as IResponse);
  }
};

const deleteCustomers: RequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Customer ID is required",
      value: null,
    } as IResponse);
  }

  try {
    const deletedCustomer = await customerModel.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        value: null,
      } as IResponse);
    }

    // Activity log
    await activityLogModel.create({
      userId: req.user!.id,
      action: `deleted customer "${deletedCustomer.name}"`,
      entityType: "Customer",
      entityId: deletedCustomer._id,
    });

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      value: null,
    } as IResponse);
  } catch (e: any) {
    console.log("error:", e.message);
    res.status(500).json({
      success: false,
      message: e.message,
      value: null,
    } as IResponse);
  }
};

export {
  createCustomer,
  getAllCustomers,
  getCustomersById,
  updateCustomers,
  deleteCustomers,
};