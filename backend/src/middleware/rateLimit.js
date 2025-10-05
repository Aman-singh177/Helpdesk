import rateLimit from "express-rate-limit";

export const userRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: { code: "RATE_LIMIT" } },
  standardHeaders: true,
  legacyHeaders: false,
});
