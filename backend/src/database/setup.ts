import { logger } from './databaseAccess.js';
import { connection } from "./databaseAccess.js";

class setupDatabase {
    /**
     * Setup the database, creating the tables if they don't exist.
     */
    public init(): void {
        logger.debug('Configuring database connection...', 'Database @ Setup Database');
        
        // Confessions table
        connection.schema.hasTable('Confessions').then((exists) => {
            if (!exists) {
                connection.schema.createTable('Confessions', (table) => {
                    table.increments('confessionId').primary();
                    table.timestamp('timestamp').defaultTo(connection.fn.now());
                    table.string('recipient');
                    table.text('message');
                }).then(() => {
                    logger.log('Created Confessions table', 'Database @ Setup Database');
                });
            } else {
                logger.debug('Confessions table already exists; skipping creation', 'Database @ Setup Database');
            }
        });
    }
}

export default new setupDatabase();
