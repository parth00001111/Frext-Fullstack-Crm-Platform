import mongoose, { model, Schema, Document } from "mongoose"; 

interface IActivityLog extends Document {
    userId: mongoose.Types.ObjectId,
    action: string,
    entityType: "Customer" | "Deal" | "Task" | "Note",
    entityId: mongoose.Types.ObjectId,
}

const activityLogSchema = new Schema<IActivityLog>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    action: {
        type: String,
        required: true,
        trim: true,
    },
    entityType: {
        type: String,
        enum: ["Customer", "Deal", "Task", "Note"],
        required: true,
    },
    entityId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true
})

const activityLogModel = model<IActivityLog>("ActivityLog", activityLogSchema);
export default activityLogModel;