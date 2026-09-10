import dns from "node:dns";
import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
  if (!process.env.MONGO_URL) throw new Error("MONGO_URL is required");
  if (process.env.MONGO_DNS_SERVERS) dns.setServers(process.env.MONGO_DNS_SERVERS.split(",").map(server => server.trim()));
  await mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 10000 });
  console.log("Connected to the database");
};

export default connectDb;
