import mongoose, { model, Schema, Document, Mongoose } from "mongoose"

interface IUser extends Document {
    name: string, 
    email: string, 
    password: string, 
    role: string, 
    
}
const userSchema = new Schema<IUser> ({
    name: {
        type: String, 
        unique: true, 
        trim: true, 
        minLength:3,
        required: true,
    },
    email: {
        type: String, 
        unique: true, 
        trim: true,
        required: true, 

    },
    password: {
        type: String, 
        minLength: 6, 
        required: true,
    }, 
    role: {
        type: String, 
        enum: ['Admin', 'Sales', 'Manager']
    },
}, {
    timestamps: true
}) 

const userModel = model<IUser>("User", userSchema);
export { userModel, IUser };