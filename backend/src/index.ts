import startExpress from './express/express.js';
import {configureLogger} from './setup/mainLogger.js';
import databaseAccess from './database/databaseAccess.js';

configureLogger();
databaseAccess.setupDatabase();
startExpress();