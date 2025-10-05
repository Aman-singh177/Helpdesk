import express from "express";
import Comment from "../models/comment.model.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/:id/comments", authMiddleware, async (req, res, next) => {
  try {
    const { message, parentId } = req.body;
    if (!message)
      return res
        .status(400)
        .json({ error: { code: "FIELD_REQUIRED", field: "message" } });

    const comment = await Comment.create({
      ticketId: req.params.id,
      userId: req.user._id,
      message,
      parentId,
    });
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

export default router;
