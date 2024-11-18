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

        if (recipient.length > 20) {
            return res.status(400).json({ error: 'Recipient exceeds 20 characters' });
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

    // GET: Fetch a specific confession by ID
    async getConfessionById(req: Request, res: Response) {
        const { id } = req.params; // Extract confessionId from route parameters

        try {
            const confession = await confessionsDatabase.getConfessionById(parseInt(id, 10));
            
            if (confession) {
                res.status(200).json(confession);
            } else {
                res.status(404).json({ error: 'Confession not found' });
            }
        } catch (error) {
            console.error('Error fetching confession by ID:', error);
            res.status(500).json({ error: 'Failed to fetch confession' });
        }
    }
    // GET: Fetch all confession IDs as a JSON array
    async getConfessionIdsAsJson(_req: Request, res: Response) {
        try {
            const confessionIds = await confessionsDatabase.getAllConfessionIds();
            
            if (!confessionIds || !confessionIds.length) {
                return res.status(404).json({ error: 'No confessions found' });
            }

            res.status(200).json(confessionIds);
        } catch (error) {
            console.error('Error fetching confession IDs:', error);
            res.status(500).json({ error: 'Failed to fetch confession IDs' });
        }
    }
}

export default ConfessionRoutes;
