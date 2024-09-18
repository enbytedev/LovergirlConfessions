import rateLimit from 'express-rate-limit';
import config from '../setup/config.js';

const browserRateLimit = rateLimit({
    windowMs: 10000,
    max: parseInt(config.rateLimit),
    message: "Too many requests from this IP, please try again after 10 seconds."
});

const confessionRateLimit = rateLimit({
    windowMs: 900000,
    max: parseInt(config.rateLimitConfession),
    message: "Too many requests from this IP, please try again after 15 minutes."
});

export { browserRateLimit, confessionRateLimit };