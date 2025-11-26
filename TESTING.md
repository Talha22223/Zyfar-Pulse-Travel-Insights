# 🧪 Testing Guide - Zyfar Pulse Survey System

This guide provides comprehensive testing procedures for the Zyfar Pulse Survey System.

## Test Environment Setup

### Local Development

1. **Start Backend:**
```bash
cd backend
npm install
npm run dev
```

Backend should be running on `http://localhost:4000`

2. **Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Frontend should be running on `http://localhost:3000`

---

## Backend API Tests

### 1. Health Check

**Test:** Verify server is running

```bash
curl http://localhost:4000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-26T...",
  "dataStore": "active"
}
```

---

### 2. Get Categories

**Test:** Retrieve all survey categories

```bash
curl http://localhost:4000/api/surveys/sample-questions
```

**Expected:** 
- Success: true
- 10 categories returned
- Each category has: id, title, emoji, tagline, questionCount

---

### 3. Get Category Questions

**Test:** Get questions for a specific category

```bash
curl http://localhost:4000/api/surveys/sample-questions?category=travel_intention
```

**Expected:**
- Success: true
- Category object with questions array
- Each question has: id, text, type, options

---

### 4. Submit Survey

**Test:** Submit a valid survey response

```bash
curl -X POST http://localhost:4000/api/surveys/submit \
  -H "Content-Type: application/json" \
  -d '{
    "category": "travel_intention",
    "answers": ["Yes, definitely", "Manali", "Solo adventure"],
    "city": "Delhi"
  }'
```

**Expected:**
- success: true
- id: Generated survey ID
- message: "Survey submitted successfully"
- insight: Personalized message

**Verify Data:**
```bash
# Check if data was saved (local testing)
cat backend/data/surveys.json
# or (production)
cat /var/zyfar_pulse/data/surveys.json
```

---

### 5. Invalid Submissions

**Test 1:** Missing category
```bash
curl -X POST http://localhost:4000/api/surveys/submit \
  -H "Content-Type: application/json" \
  -d '{
    "answers": ["Yes, definitely"]
  }'
```

**Expected:** 
- success: false
- error: "Category is required"

**Test 2:** Missing answers
```bash
curl -X POST http://localhost:4000/api/surveys/submit \
  -H "Content-Type: application/json" \
  -d '{
    "category": "travel_intention"
  }'
```

**Expected:**
- success: false
- error: "Answers array is required and must not be empty"

**Test 3:** Invalid category
```bash
curl -X POST http://localhost:4000/api/surveys/submit \
  -H "Content-Type: application/json" \
  -d '{
    "category": "invalid_category",
    "answers": ["Test"]
  }'
```

**Expected:**
- success: false
- error: "Invalid category"

---

### 6. Get Live Stats

**Test:** Retrieve aggregated statistics

```bash
curl http://localhost:4000/api/stats/live?category=travel_intention
```

**Expected:**
- success: true
- data.totalResponses: Number of submissions
- data.aggregated: Question-wise breakdown
- data.topDestinations: Array of destinations
- data.trends: Array of daily counts

---

### 7. Get City Overview

**Test:** Get city-level statistics

```bash
curl http://localhost:4000/api/stats/city-overview?city=Delhi
```

**Expected:**
- success: true
- data.city: "Delhi"
- data.totalResponses: Number
- data.safetyIndex: 0-100
- data.happinessScore: 0-100
- data.budgetAverage: String with ₹

---

### 8. Rate Limiting

**Test:** Submit multiple surveys rapidly

```bash
# Run this script to test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:4000/api/surveys/submit \
    -H "Content-Type: application/json" \
    -d "{\"category\":\"travel_intention\",\"answers\":[\"Yes\"],\"city\":\"Test\"}"
  echo ""
done
```

**Expected:**
- First 5 requests: Success
- After 5 requests within 1 minute: 429 Too Many Requests
- Error message: "Too many survey submissions, please try again later."

---

## Frontend Tests

### Manual Testing Checklist

#### 1. Header Section
- [ ] Title displays correctly
- [ ] Subtitle displays correctly
- [ ] Pulse animation is visible and animating
- [ ] "Start Survey Now" button works
- [ ] Clicking button scrolls to category selector

#### 2. Category Selector
- [ ] All 10 categories display
- [ ] Each card shows: emoji, title, tagline, question count
- [ ] Cards are horizontally scrollable
- [ ] Hover effect works on cards
- [ ] Clicking a card opens the survey

#### 3. Survey Section
- [ ] Category emoji and title display
- [ ] Progress dots show current question
- [ ] Question text displays clearly
- [ ] All options are clickable
- [ ] Selected option is highlighted
- [ ] "Next" button disabled when no selection
- [ ] "Back" button navigates to previous question
- [ ] City input appears after last question
- [ ] Submit button works
- [ ] Loading state shows during submission

#### 4. Live Insights
- [ ] Personalized insight displays
- [ ] Pie chart renders with data
- [ ] Top destinations list displays
- [ ] Trend line chart renders
- [ ] All charts are responsive

#### 5. City Pulse Overview
- [ ] Tab buttons work (All India, My City, My Last Trip)
- [ ] Statistics cards display correctly
- [ ] Safety Index shows 0-100
- [ ] Budget Average shows ₹ amount
- [ ] Happiness Score shows 0-100
- [ ] Trending destinations cards display
- [ ] Pain Point Index displays if available

#### 6. Community Share
- [ ] Section displays
- [ ] WhatsApp share button works
- [ ] Share Story button shows alert
- [ ] Footer displays

### Responsive Design Tests

**Test on:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Verify:**
- [ ] All elements are visible
- [ ] No horizontal scrolling (except category cards)
- [ ] Text is readable
- [ ] Buttons are tappable
- [ ] Charts resize properly

---

## Integration Tests

### Complete User Flow

**Scenario:** User completes a survey and views results

1. **Start:**
   - Open `http://localhost:3000`
   - Verify header loads

2. **Select Category:**
   - Click "Start Survey Now"
   - Verify scroll to categories
   - Click "Travel Intention" card
   - Verify survey section opens

3. **Answer Questions:**
   - Select "Yes, definitely"
   - Click "Next"
   - Verify progress dots update
   - Select "Manali"
   - Click "Next"
   - Select "Solo adventure"
   - Click "Continue"

4. **Enter City:**
   - Type "Delhi"
   - Click "Submit"
   - Verify loading state

5. **View Results:**
   - Verify insight message displays
   - Verify scroll to Live Insights
   - Verify pie chart renders
   - Verify trending destinations display
   - Verify trend line chart renders

6. **Check City Overview:**
   - Scroll to City Pulse Overview
   - Click "All India" tab
   - Verify statistics update
   - Click "My City" tab
   - Verify statistics update

7. **Share:**
   - Scroll to Community Share
   - Click "Share on WhatsApp"
   - Verify WhatsApp opens with message

---

## Data Validation Tests

### 1. Verify Data Persistence

After submitting a survey:

```bash
# Check data file exists
ls -la /var/zyfar_pulse/data/surveys.json
# or (local)
ls -la backend/data/surveys.json

# View contents
cat /var/zyfar_pulse/data/surveys.json | jq .
```

**Expected:**
- File exists
- Contains array of survey objects
- Latest submission is present
- All fields are correct

### 2. Test Data Aggregation

Submit multiple surveys, then:

```bash
curl http://localhost:4000/api/stats/live
```

**Verify:**
- totalResponses matches number of submissions
- Percentages add up to 100%
- Counts are accurate

---

## Performance Tests

### 1. Load Test

**Test:** Submit 100 surveys

```bash
# Create a simple load test script
for i in {1..100}; do
  curl -X POST http://localhost:4000/api/surveys/submit \
    -H "Content-Type: application/json" \
    -d "{
      \"category\":\"travel_intention\",
      \"answers\":[\"Yes, definitely\",\"Manali\",\"Solo adventure\"],
      \"city\":\"Delhi\"
    }" &
  sleep 0.1
done
```

**Monitor:**
```bash
pm2 logs zyfar-pulse
```

**Expected:**
- All submissions succeed
- Response time < 500ms
- No errors in logs

### 2. Data File Size

After submitting many surveys:

```bash
du -h /var/zyfar_pulse/data/surveys.json
```

**Monitor:** File size should grow linearly with submissions

---

## Security Tests

### 1. CORS

**Test:** Make request from different origin

```javascript
// From browser console on different domain
fetch('http://localhost:4000/api/surveys/sample-questions')
  .then(r => r.json())
  .then(console.log)
```

**Expected:** Request succeeds (CORS enabled)

### 2. Input Validation

**Test:** SQL injection attempt
```bash
curl -X POST http://localhost:4000/api/surveys/submit \
  -H "Content-Type: application/json" \
  -d '{
    "category": "travel_intention; DROP TABLE surveys;",
    "answers": ["Test"]
  }'
```

**Expected:**
- success: false
- error: "Invalid category"
- No database corruption (since we use JSON)

### 3. Large Payload

**Test:** Submit very large answer
```bash
curl -X POST http://localhost:4000/api/surveys/submit \
  -H "Content-Type: application/json" \
  -d "{
    \"category\":\"travel_intention\",
    \"answers\":[\"$(head -c 1000000 < /dev/zero | tr '\\0' 'A')\"]
  }"
```

**Expected:** Request rejected or handled gracefully

---

## Production Tests

### Post-Deployment Checklist

After deploying to VPS:

1. **SSL Certificate:**
```bash
curl https://yourdomain.com/health
```
- [ ] HTTPS works
- [ ] No certificate errors

2. **API Endpoints:**
```bash
curl https://yourdomain.com/api/surveys/sample-questions
```
- [ ] All endpoints accessible via HTTPS

3. **Frontend:**
- [ ] Open https://yourdomain.com
- [ ] No console errors
- [ ] Complete a survey end-to-end

4. **Data Storage:**
```bash
ls -la /var/zyfar_pulse/data/
cat /var/zyfar_pulse/data/surveys.json
```
- [ ] Data directory exists
- [ ] Submissions are saving

5. **PM2 Process:**
```bash
pm2 status
```
- [ ] zyfar-pulse is online
- [ ] No restarts or errors

6. **Nginx:**
```bash
sudo nginx -t
sudo systemctl status nginx
```
- [ ] Configuration valid
- [ ] Service running

---

## Automated Test Suite (Optional)

Create `backend/test/api.test.js`:

```javascript
// Example test with a testing framework
describe('Zyfar Pulse API', () => {
  test('Health check returns OK', async () => {
    const response = await fetch('http://localhost:4000/health');
    const data = await response.json();
    expect(data.status).toBe('OK');
  });

  test('Submit survey succeeds', async () => {
    const response = await fetch('http://localhost:4000/api/surveys/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'travel_intention',
        answers: ['Yes', 'Manali', 'Solo'],
        city: 'Delhi'
      })
    });
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
```

---

## Troubleshooting Common Issues

### Issue: Frontend can't connect to backend

**Check:**
```bash
# Is backend running?
pm2 status

# Is port 4000 open?
curl http://localhost:4000/health

# Check proxy configuration
cat frontend/vite.config.ts
```

### Issue: Data not saving

**Check:**
```bash
# Does directory exist?
ls -la /var/zyfar_pulse/data/

# Permissions correct?
ls -la /var/zyfar_pulse/

# Check logs
pm2 logs zyfar-pulse
```

### Issue: Charts not rendering

**Check:**
- Browser console for errors
- Recharts library loaded
- Data format is correct

---

## Test Results Template

```
ZYFAR PULSE TEST RESULTS
Date: ___________
Tester: ___________

BACKEND TESTS
[ ] Health check
[ ] Get categories
[ ] Get category questions
[ ] Submit survey - valid
[ ] Submit survey - invalid inputs
[ ] Get live stats
[ ] Get city overview
[ ] Rate limiting

FRONTEND TESTS
[ ] Header section
[ ] Category selector
[ ] Survey section
[ ] Live insights
[ ] City pulse overview
[ ] Community share
[ ] Responsive design

INTEGRATION TESTS
[ ] Complete user flow
[ ] Data persistence
[ ] End-to-end survey submission

PRODUCTION TESTS
[ ] HTTPS working
[ ] All endpoints accessible
[ ] PM2 process running
[ ] Data saving correctly

ISSUES FOUND:
1. _________________
2. _________________

NOTES:
_________________
```
