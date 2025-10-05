import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sla_due: Date,
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
