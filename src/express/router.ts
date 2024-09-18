import { Express, Router } from "express";
import { logger } from "../setup/mainLogger.js";
import { browserRateLimit } from "../express/middleware.js";
import RoutesAggregate from "./routes/routesAggregate.js";

const Routes = new RoutesAggregate();
const router = Router();

export const setRoutes = (app: Express) => {
    logger.debug(`Configuring Express routing...`, "ExpressJS Setup")

    router.get("/", browserRateLimit, Routes.basic.home);
    router.get("*", browserRateLimit, Routes.basic.notFound);
    app.use(router);
}

export default setRoutes;