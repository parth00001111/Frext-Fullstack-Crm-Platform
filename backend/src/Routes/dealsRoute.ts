import { Router } from "express"; 
import { createDeal, getAllDeal, getDealById, updateDeal, deleteDeal } from "../Controllers/dealController"
import { verifyToken } from "../Middleware/authMiddleware";
import authorize from "../Middleware/roleMiddleware"
const dealRouters = Router();

dealRouters.post("/createDeals", verifyToken, authorize("Manager", "Admin", "Sales"), createDeal )

dealRouters.get("/getAllDeals", verifyToken, authorize("Manager", "Admin", "Sales"), getAllDeal )

dealRouters.get("/getDealById/:id", verifyToken, authorize("Manager", "Admin", "Sales"), getDealById)

dealRouters.put("/updateDeals/:id", verifyToken, authorize("Manager", "Admin", "Sales"), updateDeal)

dealRouters.delete("/deleteDeals/:id", verifyToken, authorize("Admin"), deleteDeal)


export default dealRouters;