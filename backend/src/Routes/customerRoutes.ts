import { Router } from 'express';
import { createCustomer, deleteCustomers, getAllCustomers, getCustomersById, updateCustomers } from '../Controllers/customerController.ts';
import { verifyToken } from '../Middleware/authMiddleware.ts';
import authorize from '../Middleware/roleMiddleware.ts';

const customerRouter = Router();

customerRouter.post("/createCustomer", verifyToken, authorize("Admin", "Manager", "Sales"), createCustomer);

customerRouter.get("/getAllCustomer", verifyToken, authorize("Admin", "Manager", "Sales"),  getAllCustomers);

customerRouter.get("/getCustomerById/:id", verifyToken, authorize("Admin", "Manager", "Sales"), getCustomersById);

customerRouter.put("/updateCustomers/:id", verifyToken, authorize("Admin", "Manager", "Sales"), updateCustomers);

customerRouter.delete("/deleteCustomers/:id", verifyToken, authorize("Admin"), deleteCustomers);

export default customerRouter