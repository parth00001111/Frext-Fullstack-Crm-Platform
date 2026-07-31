import { type RequestHandler, type Request, type Response } from "express";
import noteModel from "../models/noteModel.ts";

interface IResponse {
    success: boolean,
    message: string,
    value?: any
}

const createNote: RequestHandler = async (req: Request, res: Response) => {
    console.log("create note hit ho gya");
    try {
        const { content, entityType, entityId } = req.body;

        if (!content || !entityType || !entityId) {
            return res.status(400).json({
                success: false,
                message: "content, entityType and entityId are required",
                value: null
            } as IResponse);
        }

        const newNote = await noteModel.create({
            content,
            entityType,
            entityId,
            createdBy: req.user!.id,
        });

        const populatedNote = await newNote.populate("createdBy", "name");

        res.status(201).json({
            success: true,
            message: "Note created Successfully",
            value: {
                ...populatedNote.toObject(),
                createdBy: (populatedNote.createdBy as any).name
            }
        } as IResponse);

    } catch (e: any) {
        console.log("error: " + e.message);
        res.status(500).json({
            success: false,
            message: e.message,
            value: null
        } as IResponse);
    }
}

const getAllNotes: RequestHandler = async (req: Request, res: Response) => {
    try {
        const allNotes = await noteModel.find().populate("createdBy", "name");
        res.status(200).json({
            success: true,
            message: "List of all notes",
            value: allNotes
        } as IResponse);
    } catch (e: any) {
        console.log("error: " + e.message);
        res.status(500).json({
            success: false,
            message: e.message,
            value: null
        } as IResponse);
    }
}

const getNotesByEntity: RequestHandler = async (req: Request, res: Response) => {
    const { entityType, entityId } = req.params;

    if (!entityType || !entityId) {
        return res.status(404).json({
            success: false,
            message: "Something's wrong with entityType or entityId",
            value: null
        } as IResponse);
    }

    try {
        const notes = await noteModel
            .find({ entityType, entityId })
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Notes for entity",
            value: notes
        } as IResponse);
    } catch (e: any) {
        console.log("error: ", e.message);
        res.status(500).json({
            success: false,
            message: e.message,
            value: null
        } as IResponse);
    }
}

const updateNote: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({
            success: false,
            message: "Enter id properly",
            value: null
        } as IResponse);
    }

    try {
        const { content } = req.body;

        const updatedNote = await noteModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...(content !== undefined ? { content } : {}),
                }
            },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
                value: null
            } as IResponse);
        }

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            value: updatedNote
        } as IResponse);

    } catch (e: any) {
        console.log("error: ", e.message);
        res.status(500).json({
            success: false,
            message: e.message,
            value: null
        } as IResponse);
    }
}

const deleteNote: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({
            success: false,
            message: "Enter id properly",
            value: null
        } as IResponse);
    }

    try {
        const deleted = await noteModel.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
                value: null
            } as IResponse);
        }

        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        } as IResponse);

    } catch (e: any) {
        console.log("error: ", e.message);
        res.status(500).json({
            success: false,
            message: e.message,
            value: null
        } as IResponse);
    }
}

export { createNote, getAllNotes, getNotesByEntity, updateNote, deleteNote };
