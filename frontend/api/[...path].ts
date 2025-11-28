import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = 'http://31.97.203.109:4000';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  const fullPath = Array.isArray(path) ? path.join('/') : path || '';
  
  // Extract query string from original URL
  const queryString = req.url?.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  const url = `${BACKEND_URL}/api/${fullPath}${queryString}`;
  
  console.log('Proxying request to:', url);
  
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Backend connection failed', details: error.message });
  }
}
