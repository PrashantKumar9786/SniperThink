require("dotenv").config();
const Bull = require("bull");

const fileQueue = new Bull("file-processing", {
  redis: process.env.REDIS_URL || "redis://localhost:6379",
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: false,
    removeOnFail: false,
  },
});

fileQueue.on("error", (err) => {
  console.error("❌ Queue error:", err.message);
});

module.exports = fileQueue;
