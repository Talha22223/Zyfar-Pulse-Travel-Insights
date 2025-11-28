import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = 'http://31.97.203.109:4000';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get the original path from the URL
    const url = new URL(req.url || '', `https://${req.headers.host}`);
    const apiPath = url.pathname; // e.g., /api/surveys/recent
    const queryString = url.search; // e.g., ?limit=20
    
    const backendUrl = `${BACKEND_URL}${apiPath}${queryString}`;
    
    console.log(`Proxying: ${req.method} ${apiPath} -> ${backendUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(backendUrl, {
      method: req.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const data = await response.json();
    return res.status(response.status).json(data);
    
  } catch (error: any) {
    console.error('Proxy error:', error);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({
        success: false,
        error: 'Gateway Timeout'
      });
    }

    return res.status(500).json({ 
      success: false,
      error: 'Connection failed',
      details: String(error)
    });
  }
}
