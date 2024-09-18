import BasicRoutes from './basic/basicRoutes.js';
import ConfessionRoutes from './confessions.js';

class RoutesAggregate {
    constructor() {
        this.basic = new BasicRoutes();
        this.confession = new ConfessionRoutes();
    }
    public basic;
    public confession;
}

export default RoutesAggregate