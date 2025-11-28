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
    
    console.log('🔄 Proxying:', req.method, req.url, '→', backendUrl);
    
    // Test backend connectivity first
    const healthCheck = await fetch(`${BACKEND_URL}/health`, { 
      method: 'GET'
    });
    
    if (!healthCheck.ok) {
      throw new Error(`Backend not healthy: ${healthCheck.status}`);
    }
    
    console.log('✅ Backend is healthy, making actual request...');
    
    // Make the actual request to backend
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0'
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,

    });

    console.log('📥 Backend response:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      return res.status(response.status).json({
        success: false,
        error: `Backend error: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log('✅ Successfully proxied request');
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('🚨 Proxy error:', error);
    
    // Return detailed error information
    return res.status(500).json({ 
      success: false,
      error: 'Proxy failed',
      details: error.message,
      backend_url: BACKEND_URL,
      timestamp: new Date().toISOString()
    });
  }
}
