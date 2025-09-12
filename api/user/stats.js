import { getUserStats } from '../../utils/database.js';
import pool from '../../utils/database.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const stats = await getUserStats(userId);
    
    // Get recent sessions
    const recentSessionsQuery = `
      SELECT tool_used, created_at 
      FROM user_sessions 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    const recentResult = await pool.query(recentSessionsQuery, [userId]);
    
    const response = {
      ...stats,
      recent_sessions: recentResult.rows
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}