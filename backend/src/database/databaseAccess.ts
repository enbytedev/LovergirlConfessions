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
    public addConfession = async (recipient: string, message: string): Promise<void> => {
        try {
            await connection('Confessions').insert({
                recipient,
                message,
                timestamp: connection.fn.now() // Automatically inserts current timestamp
            });
            logger.debug(`Added confession from ${recipient}`, 'Database @ Confessions');
        } catch (err) {
            logger.error("Error adding confession: " + err, "Database @ Confessions");
            throw err;
        }
    };

    /**
     * Get paginated confessions from the database.
     * Fetches confessions based on the provided limit and offset.
     */
    public getPaginatedConfessions = async (limit: number, offset: number): Promise<any[]> => {
        try {
            return await connection('Confessions')
                .select('confessionId', 'recipient', 'message', 'timestamp')
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .offset(offset); // Fetch confessions based on limit and offset for pagination
        } catch (err) {
            logger.error("Error fetching paginated confessions: " + err, "Database @ Confessions");
            throw err;
        }
    };

}

export default new ConfessionsDatabase();
