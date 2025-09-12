import { createUser } from '../../utils/database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In a real app, you'd integrate with Stack Auth here
    // For demo, we'll create a mock stack user ID
    const stackUserId = 'stack_' + Date.now();

    const user = await createUser(stackUserId, email, name, role);
    
    res.status(201).json({ user, success: true });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(409).json({ error: 'User already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}