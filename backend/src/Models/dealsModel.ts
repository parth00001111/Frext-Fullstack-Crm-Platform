import mongoose, { model, Schema, Document } from "mongoose"; 
interface IDeals extends Document {
    title: string; 
    value: number;
    stage: "Lead" | "Qualified" | "Proposal" | "Won" | "Lost";
    customerId: mongoose.Types.ObjectId;
    assignedTo: mongoose.Types.ObjectId;
}

const dealSchema = new Schema<IDeals>({
    title: {
        type: String, 
        required: true, 
        trim: true, 
    },
    value: {
        type: Number, 
        required: true, 

    },
    stage: {
        type: String, 
        enum: ["Lead", "Qualified", "Proposal", "Won", "Lost"],
        default: "Lead"
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
    timestamps: true
})
const dealsModel = model<IDeals>("Deals", dealSchema);
export default dealsModel;