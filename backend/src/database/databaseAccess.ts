import confectionery from 'confectionery';
import config from '../setup/config.js';
import knex, { Knex } from 'knex';
import { databaseConfiguration } from "../setup/config.js";
import setupDatabase from "./setup.js"

export const logger = confectionery.createLogger("Database");

if (config.debugMode == "true") {
    logger.setLevel(4, 4);
}
logger.setFormat('SYMBOLS');
if (config.logPath != '') {
    logger.setLogPath(config.logPath);
    logger.info("Logging to " + config.logPath, "Database Logger");
}

export const connection: Knex = knex({
    client: 'mysql2',
    connection: {
        host: databaseConfiguration.host,
        port: parseInt(databaseConfiguration.port),
        user: databaseConfiguration.user,
        password: databaseConfiguration.password,
        database: databaseConfiguration.database
    },
    pool: { min: 2, max: 10 }
});

class ConfessionsDatabase {

    /**
     * Initialize database.
     */
    public setupDatabase = setupDatabase.init;
    
    /**
     * Add a confession to the database.
     * Automatically inserts the current timestamp.
     */
    public addConfession = async (sender: string, message: string): Promise<void> => {
        try {
            await connection('Confessions').insert({
                sender,
                message,
                timestamp: connection.fn.now() // Automatically inserts current timestamp
            });
            logger.info(`Added confession from ${sender}`, 'Database @ Confessions');
        } catch (err) {
            logger.error("Error adding confession: " + err, "Database @ Confessions");
            throw err;
        }
    };

    /**
     * Get the last 100 confessions from the database.
     */
    public getLast100Confessions = async (): Promise<any[]> => {
        try {
            return await connection('Confessions')
                .select('confessionId', 'sender', 'message', 'timestamp')
                .orderBy('timestamp', 'desc')
                .limit(100);
        } catch (err) {
            logger.error("Error fetching the last 100 confessions: " + err, "Database @ Confessions");
            throw err;
        }
    };
}

export default new ConfessionsDatabase();
