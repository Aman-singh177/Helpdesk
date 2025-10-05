import express from "express";
const router = express.Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

router.get("/_meta", (req, res) =>
  res.json({
    name: "HelpDesk Mini",
    version: "1.0.0",
    uptime: process.uptime(),
    time: new Date().toISOString(),
  })
);

export default router;
