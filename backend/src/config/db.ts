import dns from 'node:dns';
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
dns.setServers([
    '8.8.8.8',
    '1.1.1.1'
])
console.log("url: " + process.env.MONGO_URL)
const connectDb = async(): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string)
        console.log("MongoDb url: " + process.env.MONGO_URL);
        console.log("✅ Connected to the databaese ")
    }catch(e: any) {
        console.log("Error: " + e.message)

    }
}

export default connectDb