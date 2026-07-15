import mongoose, { model, Schema, Document } from "mongoose"; 

export interface ICustomer extends Document {
    name: string,
    email: string,
    phone: string, 
    company?: string, 
    status: string, 
    assignedTo: mongoose.Types.ObjectId,
}

const customerSchema = new Schema<ICustomer>({
    name: {
        type: String, 
        required: true, 
        
        trim: true,
    }, 

    email: {
        type: String, 
        unique: true,
        required: true,
        trim: true, 
        
    },

    phone: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
    },

    company: {
        type: String,
        trim: true, 
        
    },

    status: {
        type: String,
        enum: ['new', 'contacted', 'closed'],
        default: "new",

    },

    assignedTo: {
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    }
    
}, {
    timestamps: true
})
const customerModel = model<ICustomer>("Customers", customerSchema);
export default customerModel;