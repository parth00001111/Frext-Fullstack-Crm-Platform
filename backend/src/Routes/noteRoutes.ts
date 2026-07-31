import { Router } from "express";
import { createNote, getAllNotes, getNotesByEntity, updateNote, deleteNote } from "../controllers/noteController.ts";
import { verifyToken } from "../Middleware/authMiddleware.ts";
import authorize from "../Middleware/roleMiddleware.ts";

const noteRouter = Router();

noteRouter.post("/createNote", verifyToken, authorize("Admin", "Manager", "Sales"), createNote);

noteRouter.get("/getAllNotes", verifyToken, authorize("Admin", "Manager", "Sales"), getAllNotes);

noteRouter.get("/getNotesByEntity/:entityType/:entityId", verifyToken, authorize("Admin", "Manager", "Sales"), getNotesByEntity);

noteRouter.put("/updateNote/:id", verifyToken, authorize("Admin", "Manager", "Sales"), updateNote);

noteRouter.delete("/deleteNote/:id", verifyToken, authorize("Admin", "Manager", "Sales"), deleteNote);

export default noteRouter;
