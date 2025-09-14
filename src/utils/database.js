import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// User management functions
export const createUser = async (stackUserId, email, name, role = 'student') => {
  try {
    const query = `
      INSERT INTO users (stack_user_id, email, name, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [stackUserId, email, name, role]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByStackId = async (stackUserId) => {
  try {
    const query = 'SELECT * FROM users WHERE stack_user_id = $1';
    const result = await pool.query(query, [stackUserId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

// Progress tracking functions
export const markTutorialComplete = async (userId, tutorialId) => {
  try {
    const query = `
      INSERT INTO user_progress (user_id, tutorial_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, tutorial_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [userId, tutorialId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error marking tutorial complete:', error);
    throw error;
  }
};

export const getUserProgress = async (userId) => {
  try {
    const query = `
      SELECT tutorial_id, completed_at 
      FROM user_progress 
      WHERE user_id = $1 
      ORDER BY completed_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
};

// Session tracking functions
export const logToolUsage = async (userId, toolUsed, sessionData = {}) => {
  try {
    const query = `
      INSERT INTO user_sessions (user_id, tool_used, session_data)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [userId, toolUsed, JSON.stringify(sessionData)]);
    return result.rows[0];
  } catch (error) {
    console.error('Error logging tool usage:', error);
    throw error;
  }
};

export const getUserStats = async (userId) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT tool_used) as tools_used,
        COUNT(*) as total_sessions,
        (SELECT COUNT(*) FROM user_progress WHERE user_id = $1) as tutorials_completed
      FROM user_sessions 
      WHERE user_id = $1
    `;
    const result = await pool.query(statsQuery, [userId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

export default pool;