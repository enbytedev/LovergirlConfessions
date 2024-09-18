import { Express, Router } from "express";
import cors from "cors";
import { logger } from "../setup/mainLogger.js";
import { browserRateLimit } from "../express/middleware.js";
import RoutesAggregate from "./routes/routesAggregate.js";

const Routes = new RoutesAggregate();
const router = Router();

export const setRoutes = (app: Express) => {
    logger.debug(`Configuring Express routing...`, "ExpressJS Setup")

    // Confessions routes
    router.get('/confessions/:page?', Routes.confession.getConfessions);
    router.put("/confessions", browserRateLimit, Routes.confession.addConfession);
        
    router.get("/", browserRateLimit, Routes.basic.home);
    router.get("*", browserRateLimit, Routes.basic.notFound);
    app.use(cors());
    app.use(router);
}

export default setRoutes;