import express from 'express';
import path from 'path';
import { logger } from '../setup/mainLogger.js';
import config from '../setup/config.js';
import setRoutes from './router.js';

export const app = express();

/**
 * Configure and start ExpressJS
 */
function startExpress() {
    configureExpress();
    // Use the router
    setRoutes(app);
    // Start the server
    app.listen(config.port, () => {
        logger.info(`Express server is listening on port ${config.port}!`, "ExpressJS Setup");
    });
}

/**
 * Configure the ExpressJS instance.
 * This configures the view engine, the public directory and the body parser. This is called before the routes are set.
 */
function configureExpress() {
    logger.debug("Configuring Express instance...", "configureExpress @ ExpressJS Setup");
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/public', express.static(path.resolve('./public/'))); // Set the public directory to find the static files (e.x. css, scripts, images)
}

export default startExpress;