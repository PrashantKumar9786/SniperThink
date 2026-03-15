# API Documentation — SniperThink

**Base URL:** `http://localhost:5000/api`  
**Content-Type:** `application/json` (except file upload which uses `multipart/form-data`)

---

## Endpoints Overview

| Method | Endpoint          | Description                               |
| ------ | ----------------- | ----------------------------------------- |
| GET    | `/health`         | Server health check                       |
| POST   | `/upload`         | Upload a file for processing              |
| GET    | `/job/:id/status` | Get current job status                    |
| GET    | `/job/:id/result` | Get processed results                     |
| POST   | `/interest`       | Register user interest in a strategy step |

---

## 1. Health Check

Check if the server is running.

**Request**

```
GET /api/health
```

**Response — 200 OK**

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 2. Upload File

Upload a PDF or TXT file for background processing.

**Request**

```
POST /api/upload
Content-Type: multipart/form-data
```

**Form Fields**

| Field | Type | Required | Description                |
| ----- | ---- | -------- | -------------------------- |
| name  | text | ✅       | User's full name           |
| email | text | ✅       | User's email address       |
| file  | file | ✅       | PDF or TXT file (max 10MB) |

**Example — cURL**

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "file=@/path/to/document.pdf"
```

**Response — 200 OK**

```json
{
  "message": "File uploaded successfully",
  "jobId": 1
}
```

**Response — 400 Bad Request**

```json
{
  "error": "Only PDF and TXT files are allowed"
}
```

**Response — 400 Bad Request**

```json
{
  "error": "name and email are required"
}
```

**What happens internally:**

1. File is saved to `uploads/` folder on server
2. User is found or created in `users` table
3. File metadata is saved in `files` table
4. A job entry is created in `jobs` table with status `pending`
5. Job is pushed to Redis queue for background processing

---

## 3. Get Job Status

Track the real-time status and progress of a processing job.

**Request**

```
GET /api/job/:id/status
```

**URL Parameters**

| Parameter | Type    | Description                 |
| --------- | ------- | --------------------------- |
| id        | integer | Job ID returned from upload |

**Example**

```
GET /api/job/1/status
```

**Response — 200 OK (Processing)**

```json
{
  "jobId": 1,
  "status": "processing",
  "progress": 50
}
```

**Response — 200 OK (Completed)**

```json
{
  "jobId": 1,
  "status": "completed",
  "progress": 100
}
```

**Response — 200 OK (Failed)**

```json
{
  "jobId": 1,
  "status": "failed",
  "progress": 10
}
```

**Response — 404 Not Found**

```json
{
  "error": "Job not found"
}
```

**Progress Stages:**

| Progress | Stage                     |
| -------- | ------------------------- |
| 0%       | Job created (pending)     |
| 10%      | Worker picked up job      |
| 50%      | Text extracted from file  |
| 80%      | Analysis complete         |
| 100%     | Results saved (completed) |

---

## 4. Get Job Result

Retrieve the analysis results once a job is completed.

**Request**

```
GET /api/job/:id/result
```

**URL Parameters**

| Parameter | Type    | Description                 |
| --------- | ------- | --------------------------- |
| id        | integer | Job ID returned from upload |

**Example**

```
GET /api/job/1/result
```

**Response — 200 OK**

```json
{
  "jobId": 1,
  "wordCount": 1200,
  "paragraphCount": 13,
  "topKeywords": ["learning", "skills", "development", "work", "problems"]
}
```

**Response — 404 Not Found**

```json
{
  "error": "Result not ready yet"
}
```

> Note: Only call this endpoint after `/job/:id/status` returns `"completed"`.

---

## 5. Register Interest

Submit user interest in a specific strategy step (Part 1 — Frontend integration).

**Request**

```
POST /api/interest
Content-Type: application/json
```

**Request Body**

| Field        | Type   | Required | Description               |
| ------------ | ------ | -------- | ------------------------- |
| name         | string | ✅       | User's full name          |
| email        | string | ✅       | User's email address      |
| selectedStep | string | ✅       | Name of the strategy step |

**Example Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "selectedStep": "Define Your Target"
}
```

**Response — 200 OK**

```json
{
  "message": "Interest registered successfully!"
}
```

**Response — 400 Bad Request**

```json
{
  "error": "name, email and selectedStep are required"
}
```

---

## Worker & Queue Configuration

### Queue System

- **Library:** Bull (built on Redis)
- **Queue Name:** `file-processing`
- **Concurrency:** 3 jobs processed simultaneously
- **Retry Policy:** Up to 3 attempts with exponential backoff (2s base delay)

### Worker Behavior

1. Worker picks a job from the Redis queue
2. Marks job status as `processing` (10%)
3. Extracts text from PDF or TXT file (50%)
4. Calculates word count, paragraph count, top keywords (80%)
5. Saves results to database (100%)
6. Marks job as `completed`

### Failure Handling

- If a worker crashes or throws an error, Bull automatically retries the job
- After 3 failed attempts, job is permanently marked as `failed`
- Retry delay doubles each attempt: 2s → 4s → 8s (exponential backoff)
- Concurrency lock prevents the same job from being processed by two workers simultaneously

### Starting the Worker

```bash
cd backend
npm run worker
```

### Redis Configuration

```env
REDIS_URL=redis://localhost:6379
```

Make sure Memurai (Redis for Windows) is running before starting the worker:

```bash
memurai-cli ping
# Expected: PONG
```
