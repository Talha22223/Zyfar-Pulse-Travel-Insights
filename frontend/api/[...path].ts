import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = 'http://31.97.203.109:4000';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Extract path from query params
    const { path } = req.query;
    let fullPath = '';
    
    if (Array.isArray(path)) {
      fullPath = path.join('/');
    } else if (path) {
      fullPath = path;
    }
    
    // Build the complete backend URL
    const queryString = req.url?.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    const backendUrl = `${BACKEND_URL}/api/${fullPath}${queryString}`;
    
    // Make the actual request to backend
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });
    
    if (!response.ok) {
      return res.status(500).json({
        success: false,
        error: `Backend error: ${response.status}`
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      error: 'Connection failed',
      details: String(error)
    });
  }
}
