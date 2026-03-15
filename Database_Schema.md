# Database Schema — SniperThink

**Database:** PostgreSQL  
**Database Name:** `sniperthink`

---

## Entity Relationship Overview

```
users
  └── files (user_id → users.id)
        └── jobs (file_id → files.id)
              └── results (job_id → jobs.id)
```

---

## Tables

### 1. `users`

Stores registered users who upload files or register interest.

| Column | Type         | Constraints      | Description                           |
| ------ | ------------ | ---------------- | ------------------------------------- |
| id     | SERIAL       | PRIMARY KEY      | Auto-incremented unique identifier    |
| name   | VARCHAR(100) | NOT NULL         | Full name of the user                 |
| email  | VARCHAR(100) | UNIQUE, NOT NULL | Email address (used to identify user) |

```sql
CREATE TABLE IF NOT EXISTS users (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);
```

---

### 2. `files`

Stores metadata about uploaded files.

| Column      | Type         | Constraints          | Description                         |
| ----------- | ------------ | -------------------- | ----------------------------------- |
| id          | SERIAL       | PRIMARY KEY          | Auto-incremented unique identifier  |
| user_id     | INTEGER      | REFERENCES users(id) | Owner of the file                   |
| file_path   | VARCHAR(255) | NOT NULL             | Path where file is stored on server |
| uploaded_at | TIMESTAMP    | DEFAULT NOW()        | Timestamp of upload                 |

```sql
CREATE TABLE IF NOT EXISTS files (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  file_path   VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3. `jobs`

Tracks the processing status of each uploaded file.

| Column     | Type        | Constraints          | Description                            |
| ---------- | ----------- | -------------------- | -------------------------------------- |
| id         | SERIAL      | PRIMARY KEY          | Auto-incremented unique job identifier |
| file_id    | INTEGER     | REFERENCES files(id) | File being processed                   |
| status     | VARCHAR(20) | DEFAULT 'pending'    | Current job state                      |
| progress   | INTEGER     | DEFAULT 0            | Progress percentage (0–100)            |
| created_at | TIMESTAMP   | DEFAULT NOW()        | When the job was created               |

**Possible Status Values:**

| Status       | Description                            |
| ------------ | -------------------------------------- |
| `pending`    | Job created, waiting for worker        |
| `processing` | Worker is actively processing the file |
| `completed`  | Processing finished successfully       |
| `failed`     | All retry attempts exhausted           |

```sql
CREATE TABLE IF NOT EXISTS jobs (
  id         SERIAL PRIMARY KEY,
  file_id    INTEGER REFERENCES files(id),
  status     VARCHAR(20) DEFAULT 'pending',
  progress   INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 4. `results`

Stores the analysis results once a job completes.

| Column          | Type    | Constraints         | Description                           |
| --------------- | ------- | ------------------- | ------------------------------------- |
| id              | SERIAL  | PRIMARY KEY         | Auto-incremented unique identifier    |
| job_id          | INTEGER | REFERENCES jobs(id) | Associated job                        |
| word_count      | INTEGER |                     | Total number of words in file         |
| paragraph_count | INTEGER |                     | Total number of paragraphs detected   |
| keywords        | JSONB   |                     | Array of top 5 most frequent keywords |

```sql
CREATE TABLE IF NOT EXISTS results (
  id              SERIAL PRIMARY KEY,
  job_id          INTEGER REFERENCES jobs(id),
  word_count      INTEGER,
  paragraph_count INTEGER,
  keywords        JSONB
);
```

---

## Complete Schema (Run This to Set Up)

```sql
CREATE DATABASE sniperthink;
\c sniperthink

CREATE TABLE IF NOT EXISTS users (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS files (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  file_path   VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id         SERIAL PRIMARY KEY,
  file_id    INTEGER REFERENCES files(id),
  status     VARCHAR(20) DEFAULT 'pending',
  progress   INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS results (
  id              SERIAL PRIMARY KEY,
  job_id          INTEGER REFERENCES jobs(id),
  word_count      INTEGER,
  paragraph_count INTEGER,
  keywords        JSONB
);
```
