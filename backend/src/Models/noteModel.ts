import mongoose, { model, Schema, Document } from "mongoose";

export interface INote extends Document {
    content: string;
    entityType: "Customer" | "Deal" | "Task";
    entityId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
}

const noteSchema = new Schema<INote>({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    entityType: {
        type: String,
        enum: ["Customer", "Deal", "Task"],
        required: true,
    },
    entityId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true
})

const noteModel = model<INote>("Note", noteSchema);
export default noteModel;
