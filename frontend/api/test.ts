import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Test the backend connection directly
  try {
    console.log('Testing backend connection from Vercel...');
    
    const response = await fetch('http://31.97.203.109:4000/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    
    return res.status(200).json({
      success: true,
      message: 'Backend connection test successful',
      backendResponse: data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Backend connection failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}