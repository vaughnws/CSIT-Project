import { markTutorialComplete, getUserProgress } from '../../utils/database.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userId, tutorialId } = req.body;
      
      if (!userId || !tutorialId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const progress = await markTutorialComplete(userId, tutorialId);
      res.status(200).json(progress);
    } catch (error) {
      console.error('Mark tutorial complete error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
      }

      const progress = await getUserProgress(userId);
      res.status(200).json(progress);
    } catch (error) {
      console.error('Get user progress error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
