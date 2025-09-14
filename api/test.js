export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    return res.status(200).json({
      message: 'API is working!',
      method: req.method,
      timestamp: new Date().toISOString(),
      environment_vars: {
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not Set',
        NODE_ENV: process.env.NODE_ENV || 'Not Set'
      }
    });
  }