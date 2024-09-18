import { Request, Response } from 'express';
import { Filter } from 'bad-words';
import confessionsDatabase from '../../database/databaseAccess.js';

const filter = new Filter({ placeHolder: '❤️' }); // Replace profanity with heart emoji

class ConfessionRoutes {
    // GET: Fetch the last 100 confessions
    async getConfessions(_req: Request, res: Response) {
        try {
            const confessions = await confessionsDatabase.getLast100Confessions();
            res.status(200).json(confessions);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch confessions' });
        }
    }

    // PUT: Add a new confession
    async addConfession(req: Request, res: Response) {
        const { sender, message } = req.body;

        if (!sender || !message) {
            return res.status(400).json({ error: 'Sender and message are required' });
        }

        const cleanedMessage = filter.clean(message);

        try {
            // Save the cleaned message to the database
            await confessionsDatabase.addConfession(sender, cleanedMessage);
            res.status(201).json({ message: 'Confession added successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add confession' });
        }
    }
}

export default ConfessionRoutes;
