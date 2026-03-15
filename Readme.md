# SniperThink — Full Stack Assignment

A full-stack application featuring an **Interactive Strategy Flow** frontend and a **Distributed File Processing System** backend.

---

## 📁 Project Structure

```
sniperthink/
├── backend/          # Node.js + Express + PostgreSQL + Redis
├── frontend/         # React + Vite + Framer Motion
├── README.md
├── DATABASE_SCHEMA.md
└── API_DOCUMENTATION.md
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

| Tool                        | Version | Download                            |
| --------------------------- | ------- | ----------------------------------- |
| Node.js                     | v18+    | https://nodejs.org                  |
| PostgreSQL                  | v14+    | https://www.postgresql.org/download |
| Memurai (Redis for Windows) | Latest  | https://www.memurai.com/get-memurai |
| Git                         | Latest  | https://git-scm.com                 |

---

## 🚀 Setup Instructions

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/sniperthink.git
cd sniperthink
```

---

### Step 2 — PostgreSQL Database Setup

Open pgAdmin or psql and run:

```sql
CREATE DATABASE sniperthink;
\c sniperthink

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  file_path VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  file_id INTEGER REFERENCES files(id),
  status VARCHAR(20) DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id),
  word_count INTEGER,
  paragraph_count INTEGER,
  keywords JSONB
);
```

---

### Step 3 — Start Redis (Memurai)

Open Services (Windows + R → services.msc) and verify **Memurai** is running.

Or test via terminal:

```bash
memurai-cli ping
# Expected: PONG
```

---

### Step 4 — Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/sniperthink
REDIS_URL=redis://localhost:6379
```

> Replace `YOUR_PASSWORD` with your PostgreSQL password.

---

### Step 5 — Frontend Setup

```bash
cd frontend
npm install
```

---

## ▶️ Running the Project

You need **3 terminals** running simultaneously:

**Terminal 1 — Backend Server**

```bash
cd backend
npm run dev
# Expected: ✅ DB connected + 🚀 Server running on port 5000
```

**Terminal 2 — Background Worker**

```bash
cd backend
npm run worker
# Expected: ✅ Worker DB connected + 🔧 Worker started
```

**Terminal 3 — Frontend**

```bash
cd frontend
npm run dev
# Expected: VITE ready at http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 🧭 Application Pages

| Page           | URL                             | Description                                 |
| -------------- | ------------------------------- | ------------------------------------------- |
| Strategy Flow  | http://localhost:5173/          | Interactive 4-step strategy with animations |
| File Dashboard | http://localhost:5173/dashboard | Upload files and track processing jobs      |

---

## 📦 Backend Scripts

```json
{
  "dev": "nodemon server.js",
  "start": "node server.js",
  "worker": "node workers/fileWorker.js"
}
```

---

## 🔗 API Base URL

```
http://localhost:5000/api
```

See `API_DOCUMENTATION.md` for full endpoint details.
