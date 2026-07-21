import { verifyToken } from './../Middleware/authMiddleware';
import { Router } from "express"; 
import { createTask, getAllTasks, getTasksById, updateTasks, deleteTasks } from "../Controllers/taskController.ts";
import authorize from '../Middleware/roleMiddleware.ts';

const taskRouters = Router();

taskRouters.post("/createTasks", verifyToken, authorize("Admin", "Manager", "Sales"), createTask)

taskRouters.get("/getAllTasks", verifyToken, authorize("Admin", "Manager", "Sales"), getAllTasks)

taskRouters.get("/getTasksById/:id", verifyToken, authorize("Admin", "Manager", "Sales"), getTasksById)

taskRouters.put("/updateTasks/:id", verifyToken, authorize("Admin", "Manager", "Sales"), updateTasks)

taskRouters.delete("/deleteTasks/:id", verifyToken, authorize("Admin", "Manager", "Sales"), deleteTasks)

export default taskRouters