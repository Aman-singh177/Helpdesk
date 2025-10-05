import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import metaRoutes from "./routes/meta.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
 
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { error: { code: "RATE_LIMIT" } },
  })
);
 
app.use("/api", metaRoutes); 
app.use("/api/auth", authRoutes); 
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", commentRoutes);
 
app.use(errorHandler);

export default app;
