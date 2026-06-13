const attempts = new Map();

export const loginRateLimit = (req, res, next) => {
  const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 10;
  const record = attempts.get(key) || { count: 0, resetAt: now + windowMs };

  if (record.resetAt < now) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  record.count += 1;
  attempts.set(key, record);

  if (record.count > maxAttempts) {
    return res.status(429).json({
      message: "Too many login attempts. Please try again after 15 minutes.",
    });
  }

  next();
};
