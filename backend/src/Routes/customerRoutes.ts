import { Router } from 'express';
import { createCustomer, deleteCustomers, getAllCustomers, getCustomersById, updateCustomers } from '../Controllers/customerController.ts';
import { verifyToken } from '../Middleware/authMiddleware.ts';
import authorize from '../Middleware/roleMiddleware.ts';

const customerRouter = Router();

customerRouter.post("/createCustomer", verifyToken, authorize("Admin", "Manager", "Sales"), createCustomer);
customerRouter.get("/getAllCustomer", verifyToken, getAllCustomers);
customerRouter.get("/getCustomerById/:id", verifyToken, getCustomersById);
customerRouter.put("/updateCustomers", verifyToken, updateCustomers);
customerRouter.delete("/deleteCustomers", verifyToken, deleteCustomers);

export default customerRouter;
