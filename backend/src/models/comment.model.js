import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
