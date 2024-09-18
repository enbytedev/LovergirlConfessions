import { Request, Response } from 'express';

class BasicRoutes {
    home(_req: Request, res: Response) {
        res.status(200).send("Server online")
    }
    notFound(_req: Request, res: Response) {
        res.status(404).send("Not Found")
    }
}

export default BasicRoutes;