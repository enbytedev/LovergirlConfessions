import { Request, Response } from 'express';
import { Filter } from 'bad-words';
import confessionsDatabase from '../../database/databaseAccess.js';

const filter = new Filter({ placeHolder: '❤️' }); // Replace profanity with heart emoji

class ConfessionRoutes {
    // GET: Fetch confessions with pagination
    async getConfessions(req: Request, res: Response) {
        const page = parseInt(req.params.page, 10) || 0; // Default to page 0 if not provided
        const limit = 24;
        const offset = page * limit;

        try {
            const confessions = await confessionsDatabase.getPaginatedConfessions(limit, offset);
            res.status(200).json(confessions);
        } catch (error) {
            console.error('Error fetching paginated confessions:', error);
            res.status(500).json({ error: 'Failed to fetch confessions' });
        }
    }

    // PUT: Add a new confession
    async addConfession(req: Request, res: Response) {
        const { recipient, message } = req.body;

        if (!recipient || !message) {
            return res.status(400).json({ error: 'Recipient and message are required' });
        }
        
        if (message.length > 150) {
        return res.status(400).json({ error: 'Message exceeds 150 characters' });
        }

        const cleanedRecipient = filter.clean(recipient);
        const cleanedMessage = filter.clean(message);

        try {
            // Save the cleaned message to the database
            await confessionsDatabase.addConfession(cleanedRecipient, cleanedMessage);
            res.status(201).json({ message: 'Confession added successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add confession' });
        }
    }
}

export default ConfessionRoutes;
