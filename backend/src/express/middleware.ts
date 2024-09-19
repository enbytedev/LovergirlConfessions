import rateLimit from 'express-rate-limit';
import config from '../setup/config.js';
import { logger } from '../setup/mainLogger.js';

const browserRateLimit = rateLimit({
    windowMs: 10000,
    max: parseInt(config.rateLimit),
    message: "Too many requests from this IP, please try again after 10 seconds.",
    handler: (req, res, next, options) => {
        const ip = req.ip;
        logger.warn(`Rate limit exceeded for IP: ${ip}`, "Ratelimit Middleware");
        res.status(options.statusCode).send(options.message);
    }
});

const confessionRateLimit = rateLimit({
    windowMs: 900000,
    max: parseInt(config.rateLimitConfession),
    message: "Too many requests from this IP, please try again after 15 minutes.",
    handler: (req, res, next, options) => {
        const ip = req.ip;
        logger.warn(`Confession rate limit exceeded for IP: ${ip}`, "Ratelimit Middleware");
        res.status(options.statusCode).send(options.message);
    }
});

export { browserRateLimit, confessionRateLimit };
