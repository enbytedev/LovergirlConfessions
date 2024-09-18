import * as dotenv from 'dotenv';

dotenv.config()

interface GeneralConfiguration {
    port: string;
    debugMode: string;
    logPath: string;
    rateLimit: string;
    rateLimitConfession: string;
}

interface DatabaseConfiguration {
    host: string;
    port: string;
    user: string;
    password: string;
    database: string;
}

const generalConfiguration = {
    port: process.env.port ?? '8080',
    logPath: process.env.logPath ?? 'logs/',
    debugMode: process.env.debugMode ?? 'false',
    rateLimit: process.env.rateLimit ?? '60',
    rateLimitConfession: process.env.rateLimitConfession ?? '5',
} as GeneralConfiguration;
export default generalConfiguration;

const databaseConfiguration = {
    host: process.env.dbHost ?? 'localhost',
    port: process.env.dbPort ?? '3306',
    user: process.env.dbUser ?? 'root',
    password: process.env.dbPassword ?? 'password',
    database: process.env.dbName ?? 'database'
} as DatabaseConfiguration;
export { databaseConfiguration };