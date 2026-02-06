# 🏃 Whoop API Integration Guide

Complete guide to the Whoop API endpoints, OAuth 2.0 authentication, and webhook setup.

## 🔐 OAuth 2.0 Flow

### Authorization Code Flow

```
┌─────────────┐
│   Client    │ Step 1: Redirect to Auth
│ (Dashboard) │──────────────────────────→ Whoop Auth
└─────────────┘                            Endpoint
                                               │
                                          User Logs In
                                          User Grants
                                          Permission
                                               │
                                              ▼
┌─────────────┐  Step 3: Authorization Code
│   Client    │←────────────────────────── Browser
└─────────────┘                           (Redirect)
      │
      │ Step 4: Exchange Code for Token
      │ (Server-to-Server)
      │
      ▼
  Whoop API
  Server
      │
      │ Step 5: Return Access Token
      │
      ▼
┌─────────────┐
│   Client    │ Step 6: Use Token to Fetch Data
│ (Dashboard) │────────────────────────────────→ Whoop API
└─────────────┘ ←──────────────────────────────────────
                   Health Data (Sleep, Recovery, etc)
```

## 🔑 Authentication

### 1. Get Authorization Code

Redirect user to:

```
https://api.whoop.com/oauth/oauth2/auth?
  client_id={YOUR_CLIENT_ID}&
  redirect_uri={YOUR_REDIRECT_URI}&
  response_type=code&
  scope=read:cycles%20read:sleep%20read:strain%20read:recovery%20read:heart_rate%20read:physiological_data
```

### 2. Exchange Code for Tokens

```bash
curl -X POST https://api.whoop.com/oauth/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&
      client_id=YOUR_CLIENT_ID&
      client_secret=YOUR_CLIENT_SECRET&
      code=AUTHORIZATION_CODE&
      redirect_uri=YOUR_REDIRECT_URI"
```

Response:

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### 3. Use Access Token

All API requests include the token:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://api.whoop.com/api/v2/cycles
```

### 4. Refresh Token When Expired

```bash
curl -X POST https://api.whoop.com/oauth/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token&
      client_id=YOUR_CLIENT_ID&
      client_secret=YOUR_CLIENT_SECRET&
      refresh_token=YOUR_REFRESH_TOKEN"
```

## 📊 API Endpoints

### Base URL
```
https://api.whoop.com/api/v2
```

### 1. Get Cycles

**Endpoint**: `GET /cycles`

**Query Parameters**:
```
start: 2026-01-01 (ISO date)
end: 2026-01-31 (ISO date)
limit: 20 (default)
offset: 0 (default)
```

**Request**:
```bash
curl -H "Authorization: Bearer TOKEN" \
  "https://api.whoop.com/api/v2/cycles?start=2026-01-01&end=2026-01-31"
```

**Response**:
```json
{
  "records": [
    {
      "id": "12345678",
      "created_at": "2026-01-15T00:00:00Z",
      "start": "2026-01-15T00:00:00Z",
      "end": "2026-01-16T00:00:00Z",
      "user_id": "user123"
    }
  ]
}
```

### 2. Get Sleep Data

**Endpoint**: `GET /cycles/{cycle_id}/sleep`

**Request**:
```bash
curl -H "Authorization: Bearer TOKEN" \
  "https://api.whoop.com/api/v2/cycles/12345678/sleep"
```

**Response**:
```json
{
  "score_state": "good",
  "sleep_performance_percentage": 82,
  "total_sleep_seconds": 28800,
  "sleep_onset_latency_seconds": 300,
  "rem_sleep_seconds": 5400,
  "light_sleep_seconds": 15400,
  "deep_sleep_seconds": 5400,
  "sleepiness_at_bedtime": 3
}
```

### 3. Get Strain Data

**Endpoint**: `GET /cycles/{cycle_id}/strain`

**Request**:
```bash
curl -H "Authorization: Bearer TOKEN" \
  "https://api.whoop.com/api/v2/cycles/12345678/strain"
```

**Response**:
```json
{
  "score": 5.2,
  "kilojoule_burned": 8500,
  "average_heart_rate": 125,
  "max_heart_rate": 185
}
```

### 4. Get Recovery Data

**Endpoint**: `GET /cycles/{cycle_id}/recovery`

**Request**:
```bash
curl -H "Authorization: Bearer TOKEN" \
  "https://api.whoop.com/api/v2/cycles/12345678/recovery"
```

**Response**:
```json
{
  "recovery_score": 72,
  "resting_heart_rate": 52,
  "hrv_status": "good",
  "somatosensory_status": "good",
  "respiratory_rate": 14
}
```

### 5. Get Physiological Data

**Endpoint**: `GET /cycles/{cycle_id}/physiological_data`

**Request**:
```bash
curl -H "Authorization: Bearer TOKEN" \
  "https://api.whoop.com/api/v2/cycles/12345678/physiological_data"
```

**Response**:
```json
{
  "heart_rate": {
    "average": 125,
    "max": 185,
    "min": 48
  },
  "hrv": {
    "value": 42,
    "status": "good"
  },
  "respiratory_rate": 14,
  "skin_temp_celsius": 36.5
}
```

### 6. Get User Profile

**Endpoint**: `GET /user/profile`

**Request**:
```bash
curl -H "Authorization: Bearer TOKEN" \
  "https://api.whoop.com/api/v2/user/profile"
```

**Response**:
```json
{
  "user_id": "user123",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "birth_date": "1990-01-01",
  "gender": "M",
  "height_cm": 180,
  "weight_kg": 80
}
```

## 🔄 Webhooks Setup

### Register Webhook Endpoint

```bash
curl -X POST https://api.whoop.com/api/v2/webhooks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/api/webhooks/whoop",
    "events": [
      "cycle.created",
      "sleep.updated",
      "strain.updated",
      "recovery.updated"
    ]
  }'
```

### Webhook Events

Your endpoint will receive POST requests:

```json
{
  "event": "cycle.created",
  "data": {
    "id": "12345678",
    "user_id": "user123",
    "created_at": "2026-01-15T00:00:00Z",
    "start": "2026-01-15T00:00:00Z",
    "end": "2026-01-16T00:00:00Z"
  }
}
```

### Example Webhook Handler (Node.js)

```javascript
// api/webhooks/whoop.js
import crypto from 'crypto';

export default async function handler(req, res) {
  // Verify webhook signature
  const signature = req.headers['x-whoop-signature'];
  const payload = JSON.stringify(req.body);
  
  const hash = crypto
    .createHmac('sha256', process.env.WHOOP_CLIENT_SECRET)
    .update(payload)
    .digest('hex');
  
  if (hash !== signature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Handle different events
  const { event, data } = req.body;

  switch (event) {
    case 'cycle.created':
      console.log('New cycle:', data);
      // Update database
      break;
    case 'sleep.updated':
      console.log('Sleep updated:', data);
      // Send notification to user
      break;
    case 'recovery.updated':
      console.log('Recovery updated:', data);
      // Update dashboard
      break;
  }

  res.status(200).json({ success: true });
}
```

## 📈 Data Structure Examples

### Full Cycle Data

```javascript
const cycle = {
  id: '12345678',
  created_at: '2026-01-15T00:00:00Z',
  start: '2026-01-15T00:00:00Z',
  end: '2026-01-16T00:00:00Z',
  user_id: 'user123',
  sleep: {
    score_state: 'good',
    sleep_performance_percentage: 82,
    total_sleep_seconds: 28800,
  },
  strain: {
    score: 5.2,
    kilojoule_burned: 8500,
    average_heart_rate: 125,
  },
  recovery: {
    recovery_score: 72,
    resting_heart_rate: 52,
    hrv_status: 'good',
  }
};
```

## 🧪 Testing with cURL

### Get Latest Cycles

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.whoop.com/api/v2/cycles?start=2026-01-01&end=2026-01-31"
```

### Get Specific Cycle Details

```bash
# Replace CYCLE_ID with actual ID
CYCLE_ID="12345678"

curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.whoop.com/api/v2/cycles/$CYCLE_ID/sleep"

curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.whoop.com/api/v2/cycles/$CYCLE_ID/strain"

curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.whoop.com/api/v2/cycles/$CYCLE_ID/recovery"
```

## 🛡️ Error Handling

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Use data |
| 400 | Bad Request | Check parameters |
| 401 | Unauthorized | Refresh token |
| 403 | Forbidden | Check scopes |
| 404 | Not Found | Verify ID |
| 429 | Rate Limited | Wait before retry |
| 500 | Server Error | Retry later |

### Error Response

```json
{
  "error": "invalid_token",
  "error_description": "The access token expired"
}
```

### Handle Errors in React

```javascript
async function fetchCycles() {
  try {
    const response = await fetch(
      'https://api.whoop.com/api/v2/cycles',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (response.status === 401) {
      // Token expired - refresh it
      await refreshAccessToken();
      return fetchCycles(); // Retry
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    // Show error to user
  }
}
```

## ⏱️ Rate Limiting

- **Limit**: 60 requests per minute
- **Header**: `X-Rate-Limit-Remaining`

```bash
curl -i https://api.whoop.com/api/v2/cycles
# Look for headers:
# X-Rate-Limit-Limit: 60
# X-Rate-Limit-Remaining: 59
```

## 📚 Response Data

### Status Values

**Sleep**:
- `excellent` (≥85%)
- `good` (70-84%)
- `fair` (55-69%)
- `poor` (<55%)

**Recovery**:
- `excellent` (≥85%)
- `good` (70-84%)
- `fair` (55-69%)
- `poor` (<55%)

**HRV Status**:
- `excellent` (≥40 ms)
- `good` (30-39 ms)
- `fair` (20-29 ms)
- `poor` (<20 ms)

## 🔗 Useful Links

- [Whoop API Docs](https://developer.whoop.com/docs)
- [API Reference](https://api.whoop.com/docs)
- [OAuth Documentation](https://developer.whoop.com/docs/authentication)
- [Webhook Guide](https://developer.whoop.com/docs/webhooks)
- [Rate Limiting](https://developer.whoop.com/docs/rate-limiting)

## 💡 Best Practices

1. **Store Tokens Securely**
   ```javascript
   // ✅ Good: Store in secure HTTP-only cookies
   // ❌ Bad: Store in localStorage (XSS vulnerable)
   ```

2. **Implement Token Refresh**
   ```javascript
   // Automatically refresh before expiration
   setTimeout(refreshToken, expiresIn * 1000 * 0.9);
   ```

3. **Cache Data**
   ```javascript
   // Cache cycles for 5 minutes
   const cache = {};
   if (Date.now() - cache.timestamp < 5 * 60 * 1000) {
     return cache.data;
   }
   ```

4. **Batch Requests**
   ```javascript
   // Fetch all cycle data in parallel
   Promise.all([
     getSleep(cycleId),
     getStrain(cycleId),
     getRecovery(cycleId)
   ]);
   ```

5. **Handle Pagination**
   ```javascript
   // Fetch all cycles by paginating
   let allCycles = [];
   let offset = 0;
   while (true) {
     const data = await getCycles(offset);
     allCycles.push(...data.records);
     if (data.records.length < 20) break;
     offset += 20;
   }
   ```

---

**Need help? Check [Whoop Developer Support](https://developer.whoop.com/support)**
