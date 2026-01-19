import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";
import redis from "../utils/connection/redisClient.js";

export const banCheck = async (req: Request, res: Response, next: NextFunction) => {
 try{
    const ip = req.ip;
    const recordStr = await redis.get(`banned:${ip}`);
    const record = recordStr ? JSON.parse(recordStr) : null;

    const now = Date.now();

    if (record?.bannedUntil && record.bannedUntil > now) {
      const secondsLeft = Math.ceil((record.bannedUntil - now) / 1000);

      return res.status(403).json({
        message: "Your IP has been temporarily banned. Try again later.",
        cooldown: secondsLeft,
        banLiftAt: record.bannedUntil,
      });
    }

    if (record?.bannedUntil && record.bannedUntil <= now) {
      await redis.del(`banned:${ip}`);
    }

    next();
 } catch (error) {
    next(error);
 }
};

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req: Request, res: Response) => {
    const ip = req.ip;
    const now = Date.now();

    const recordStr = await redis.get(`banned:${ip}`);
    const record = recordStr ? JSON.parse(recordStr) : { count: 0, firstViolationAt: now };

    if (now - record.firstViolationAt > 60 * 1000) {
      record.count = 0;
      record.firstViolationAt = now;
    }

    record.count += 1;

    if (record.count >= 2) {
      record.bannedUntil = now + 1 * 60 * 1000;
    }

    await redis.set(`banned:${ip}`, JSON.stringify(record), "PX", 5 * 60 * 1000);

    return res.status(429).json({
      message: record.bannedUntil
        ? "Your IP has been temporarily banned due to excessive requests."
        : "Too many requests. Please slow down.",
    });
  },
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req: Request, res: Response) => {
    const ip = req.ip;
    const now = Date.now();

    const recordStr = await redis.get(`banned:${ip}`);
    const record = recordStr ? JSON.parse(recordStr) : { count: 0, firstViolationAt: now };

    if (now - record.firstViolationAt > 10 * 60 * 1000) {
      record.count = 0;
      record.firstViolationAt = now;
    }

    record.count += 1;

    if (record.count >= 2) {
      record.bannedUntil = now + 15 * 60 * 1000;
    }

    await redis.set(`banned:${ip}`, JSON.stringify(record), "PX", 15 * 60 * 1000);

    return res.status(429).json({
      message: record.bannedUntil
        ? "You have been temporarily banned due to excessive requests."
        : "Too many attempts, please slow down.",
    });
  },
});

