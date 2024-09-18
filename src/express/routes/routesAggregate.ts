import BasicRoutes from './basic/basicRoutes.js';

class RoutesAggregate {
    constructor() {
        this.basic = new BasicRoutes();
    }
    public basic;
}

export default RoutesAggregate