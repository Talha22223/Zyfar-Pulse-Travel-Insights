const BACKEND_URL = 'http://31.97.203.109:4000';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/surveys/sample-questions`);
    
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
      error: 'Connection failed'
    });
  }
}