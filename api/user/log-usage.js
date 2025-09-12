import { logToolUsage } from '../../utils/database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, toolUsed, sessionData } = req.body;
    
    if (!userId || !toolUsed) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const session = await logToolUsage(userId, toolUsed, sessionData);
    res.status(200).json(session);
  } catch (error) {
    console.error('Log tool usage error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}