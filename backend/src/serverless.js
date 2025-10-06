import serverless from "serverless-http";
import app from "./app.js";
import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

// Wrap Express app in serverless handler
const handler = serverless(app);

export default async function (req, res) {
  await connectDB();
  return handler(req, res);
}
