import app from "./app.js";
import { connectDB } from "./config/db.js";

// Connect to MongoDB before handling requests
await connectDB();

// Export the app for Vercel serverless
export default app;
