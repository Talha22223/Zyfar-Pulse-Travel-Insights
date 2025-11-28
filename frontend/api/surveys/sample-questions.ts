import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = 'http://31.97.203.109:4000';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🔄 Fetching sample questions from backend...');
    
    const response = await fetch(`${BACKEND_URL}/api/surveys/sample-questions`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Vercel-SampleQuestions/1.0'
      },

    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error:', response.status, errorText);
      return res.status(response.status).json({
        success: false,
        error: `Backend returned ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log('✅ Sample questions fetched successfully');
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('🚨 Error fetching sample questions:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch sample questions',
      details: error.message
    });
  }
}