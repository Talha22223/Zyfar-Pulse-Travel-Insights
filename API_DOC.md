# 📚 API Documentation - Zyfar Pulse Survey System

Base URL: `https://yourdomain.com/api` (Production)  
Local URL: `http://localhost:4000/api` (Development)

## Authentication

No authentication required. Rate limiting is applied to all endpoints.

## Rate Limiting

- **General endpoints:** 100 requests per 15 minutes per IP
- **Survey submission:** 5 requests per minute per IP

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check if the API server is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-26T10:30:00.000Z",
  "dataStore": "active"
}
```

---

### 2. Submit Survey

**POST** `/api/surveys/submit`

Submit a completed survey response.

**Request Body:**
```json
{
  "category": "travel_intention",
  "questions": ["ti_q1", "ti_q2", "ti_q3"],
  "answers": ["Yes, definitely", "Manali", "Solo adventure"],
  "city": "Delhi",
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| category | string | Yes | Category ID (e.g., "travel_intention") |
| questions | array[string] | No | Array of question IDs |
| answers | array[string] | Yes | Array of user answers |
| city | string | No | User's city (defaults to "Unknown") |
| timestamp | string | No | ISO timestamp (auto-generated if not provided) |

**Response:**
```json
{
  "success": true,
  "id": "survey_1732617000000_abc123xyz",
  "message": "Survey submitted successfully",
  "insight": "You're part of 42% who chose \"Yes, definitely\"!"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Category is required"
}
```

---

### 3. Get Live Statistics

**GET** `/api/stats/live?category={categoryId}`

Retrieve aggregated statistics and insights for survey responses.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category ID. Omit for all categories |

**Example:**
```
GET /api/stats/live?category=travel_intention
```

**Response:**
```json
{
  "success": true,
  "category": "travel_intention",
  "data": {
    "totalResponses": 150,
    "aggregated": {
      "ti_q1": [
        {
          "answer": "Yes, definitely",
          "count": 63,
          "percentage": 42
        },
        {
          "answer": "Maybe, still deciding",
          "count": 52,
          "percentage": 35
        },
        {
          "answer": "No, not planning",
          "count": 35,
          "percentage": 23
        }
      ]
    },
    "topDestinations": [
      {
        "name": "Manali",
        "count": 45
      },
      {
        "name": "Goa",
        "count": 38
      }
    ],
    "trends": [
      {
        "date": "2025-11-20",
        "count": 12
      },
      {
        "date": "2025-11-21",
        "count": 15
      }
    ]
  }
}
```

---

### 4. Get City Overview

**GET** `/api/stats/city-overview?city={cityName}`

Retrieve city-level pulse overview including safety index, budget average, and trending destinations.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| city | string | No | City name. Omit for "All India" view |

**Example:**
```
GET /api/stats/city-overview?city=Delhi
```

**Response:**
```json
{
  "success": true,
  "data": {
    "city": "Delhi",
    "totalResponses": 75,
    "trendingDestinations": [
      {
        "name": "Manali",
        "count": 20
      },
      {
        "name": "Goa",
        "count": 15
      }
    ],
    "safetyIndex": 78,
    "budgetAverage": "₹22,500",
    "happinessScore": 82,
    "painPointIndex": "Overpricing"
  }
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| safetyIndex | number | Score 0-100 based on safety category responses |
| budgetAverage | string | Average budget from price sensitivity responses |
| happinessScore | number | Score 0-100 from post trip feedback |
| painPointIndex | string | Most common problem from local problems category |

---

### 5. Get Survey Categories

**GET** `/api/surveys/sample-questions`

Retrieve all available survey categories.

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "id": "travel_intention",
      "title": "Travel Intention",
      "emoji": "✈️",
      "tagline": "Where are you dreaming to go next?",
      "questionCount": 3
    },
    {
      "id": "destination_experience",
      "title": "Destination Experience",
      "emoji": "🏖️",
      "tagline": "How was your last travel experience?",
      "questionCount": 4
    }
  ]
}
```

---

### 6. Get Category Questions

**GET** `/api/surveys/sample-questions?category={categoryId}`

Retrieve questions for a specific category.

**Example:**
```
GET /api/surveys/sample-questions?category=travel_intention
```

**Response:**
```json
{
  "success": true,
  "category": {
    "id": "travel_intention",
    "title": "Travel Intention",
    "emoji": "✈️",
    "tagline": "Where are you dreaming to go next?",
    "questions": [
      {
        "id": "ti_q1",
        "text": "Are you planning a trip in the next 3 months?",
        "type": "single",
        "options": [
          "Yes, definitely",
          "Maybe, still deciding",
          "No, not planning"
        ]
      }
    ]
  }
}
```

---

### 7. Get All Surveys (Admin)

**GET** `/api/surveys/all`

Retrieve summary statistics of all surveys.

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 523,
    "categories": {
      "travel_intention": 150,
      "destination_experience": 120,
      "safety": 95
    },
    "cities": {
      "Delhi": 125,
      "Mumbai": 98,
      "Bangalore": 87
    },
    "recentSubmissions": [
      {
        "id": "survey_1732617000000_abc123",
        "category": "travel_intention",
        "city": "Delhi",
        "timestamp": "2025-11-26T10:30:00.000Z"
      }
    ]
  }
}
```

---

## Survey Categories

The system supports exactly 10 categories:

1. **travel_intention** - Travel planning and destination interests
2. **destination_experience** - Past travel experiences
3. **event_festival** - Event-based travel preferences
4. **local_problems** - Challenges faced during travel
5. **price_sensitivity** - Budget and spending preferences
6. **preference** - Travel style and booking preferences
7. **safety** - Safety perceptions and concerns
8. **post_trip_feedback** - Overall satisfaction ratings
9. **micro_trend** - Current travel trends
10. **partner_feedback** - Platform and service feedback

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Category/resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Data Storage

All survey data is stored locally on the VPS at:
```
/var/zyfar_pulse/data/surveys.json
```

Format: Array of survey submission objects

**Example Entry:**
```json
{
  "category": "travel_intention",
  "questions": ["ti_q1", "ti_q2", "ti_q3"],
  "answers": ["Yes, definitely", "Manali", "Solo adventure"],
  "city": "Delhi",
  "timestamp": "2025-11-26T10:30:00.000Z",
  "id": "survey_1732617000000_abc123xyz"
}
```

---

## CORS Configuration

The API allows cross-origin requests. In production, update the `CORS_ORIGIN` environment variable to your domain.

---

## Example Usage

### JavaScript/Fetch

```javascript
// Submit survey
const response = await fetch('https://yourdomain.com/api/surveys/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    category: 'travel_intention',
    answers: ['Yes, definitely', 'Manali', 'Solo adventure'],
    city: 'Delhi'
  })
});

const result = await response.json();
console.log(result.insight);
```

### cURL

```bash
# Submit survey
curl -X POST https://yourdomain.com/api/surveys/submit \
  -H "Content-Type: application/json" \
  -d '{
    "category": "travel_intention",
    "answers": ["Yes, definitely", "Manali", "Solo adventure"],
    "city": "Delhi"
  }'

# Get stats
curl https://yourdomain.com/api/stats/live?category=travel_intention
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- The API is stateless - no sessions or cookies
- Data persistence uses local JSON file (no database)
- Automatic file creation if data directory doesn't exist
