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
    
    console.log(`Proxying request to: ${backendUrl}`);

    // Create a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s timeout to beat Vercel's 10s limit

    try {
      // Make the actual request to backend
      const response = await fetch(backendUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Backend responded with status: ${response.status}`);
        return res.status(response.status).json({
          success: false,
          error: `Backend error: ${response.status}`
        });
      }

      const data = await response.json();
      return res.status(200).json(data);
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Proxy error:', error);
      
      if (error.name === 'AbortError') {
        return res.status(504).json({
          success: false,
          error: 'Gateway Timeout',
          details: 'Backend request timed out'
        });
      }

      return res.status(500).json({ 
        success: false,
        error: 'Connection failed',
        details: String(error)
      });
    }
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal Server Error',
      details: String(error)
    });
  }
}
