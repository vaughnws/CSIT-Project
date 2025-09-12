import { createUser, getUserByStackId } from '../../utils/database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { stackUserId, email, name } = req.body;

    if (!stackUserId || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    let user = await getUserByStackId(stackUserId);
    
    if (!user) {
      // Create new user
      user = await createUser(stackUserId, email, name);
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Sync user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}