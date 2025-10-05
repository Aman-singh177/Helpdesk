import express from "express";
import Ticket from "../models/ticket.model.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { calculateSLA } from "../utils/sla.js";
import { checkIdempotency } from "../utils/idempotency.js";

const router = express.Router();

// Create ticket  
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const idempotencyKey = req.headers["idempotency-key"];
    if (idempotencyKey && !checkIdempotency(idempotencyKey)) {
      return res.status(409).json({ error: { code: "DUPLICATE_REQUEST" } });
    }

    const { title, description, priority } = req.body;
    if (!title)
      return res
        .status(400)
        .json({ error: { code: "FIELD_REQUIRED", field: "title" } });

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      createdBy: req.user._id,
      sla_due: calculateSLA(priority),
    });

    res.json(ticket);
  } catch (err) {
    next(err);
  }
});


// List/search with pagination
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { limit = 10, offset = 0, q } = req.query;
    const filter = {};

    if (req.user.role === "user") filter.createdBy = req.user._id;
    if (q) filter.$text = { $search: q };

    //  SLA breach filter
    if (req.query.status === "breached") {
      filter.sla_due = { $lt: new Date() };
      filter.status = { $ne: "closed" };
    }

    const items = await Ticket.find(filter)
      .skip(Number(offset))
      .limit(Number(limit))
      .populate("assignee", "name")
      .lean();

    const next_offset = items.length < limit ? null : Number(offset) + Number(limit);
    res.json({ items, next_offset });
  } catch (err) {
    next(err);
  }
});

// Get single ticket
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("assignee", "name")
      .populate("createdBy", "name")
      .lean();
    if (!ticket)
      return res.status(404).json({ error: { code: "NOT_FOUND" } });
    res.json(ticket);
  } catch (err) {
    next(err);
  }
});

// Update ticket with optimistic locking
router.patch("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { status, assignee } = req.body;
    const clientVersion = req.headers["if-match"];
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket)
      return res.status(404).json({ error: { code: "NOT_FOUND" } });

    // optimistic lock check
    if (clientVersion && ticket.version !== Number(clientVersion))
      return res.status(409).json({ error: { code: "STALE_VERSION" } });

    if (status) ticket.status = status;
    if (assignee && req.user.role === "admin") ticket.assignee = assignee;
    ticket.version += 1;
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    next(err);
  }
});

export default router;
