import * as dotenv from 'dotenv';

dotenv.config()

interface GeneralConfiguration {
    port: string;
    debugMode: string;
    logPath: string;
    rateLimit: string;
}

const generalConfiguration = {
    port: process.env.port ?? '8080',
    logPath: process.env.logPath ?? 'logs/',
    debugMode: process.env.debugMode ?? 'false',
    rateLimit: process.env.rateLimit ?? '1000'
} as GeneralConfiguration;
export default generalConfiguration;