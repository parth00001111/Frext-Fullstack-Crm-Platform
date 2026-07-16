import mongoose, { model, Schema, Document } from "mongoose"; 

interface ITask extends Document {
    title: string ,
    dueDate: Date, 
    status: "Pending" | "In Progress" | "Completed",
    customerId: mongoose.Types.ObjectId,
    assignedTo: mongoose.Types.ObjectId
}
const taskSchema = new Schema<ITask>({
    title: {
        type: String, 
        required: true, 
        trim: true, 

    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String, 
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customers", 
        required: true, 

    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    }
}, {
    timestamps: true,
})

const taskModel = model<ITask>("Tasks", taskSchema);

export default taskModel