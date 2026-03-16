import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ResultCard from "./ResultCard";

const statusColors = {
  pending: "#F7971E",
  processing: "#6C63FF",
  completed: "#11998E",
  failed: "#F64F59",
};

const statusIcons = {
  pending: "⏳",
  processing: "⚙️",
  completed: "✅",
  failed: "❌",
};
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export default function JobTracker({ jobIds }) {
  const [jobs, setJobs] = useState({});

  useEffect(() => {
    if (!jobIds.length) return;

    const poll = async () => {
      const updates = {};
      for (const id of jobIds) {
        if (jobs[id]?.status === "completed" || jobs[id]?.status === "failed") {
          updates[id] = jobs[id];
          continue;
        }
        try {
          const res = await axios.get(
            `${API}/job/${id}/status`,
          );
          updates[id] = res.data;
          if (res.data.status === "completed" && !jobs[id]?.result) {
            const resultRes = await axios.get(
              `${API}/job/${id}/result`
            );
            updates[id].result = resultRes.data;
          }
        } catch {
          updates[id] = { jobId: id, status: "failed", progress: 0 };
        }
      }
      setJobs((prev) => ({ ...prev, ...updates }));
    };

    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [jobIds]);

  if (!jobIds.length) return null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3
        style={{
          color: "#fff",
          marginBottom: "1.5rem",
          fontWeight: 700,
          fontSize: "1.3rem",
        }}
      >
        Job Queue
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        <AnimatePresence>
          {jobIds.map((id) => {
            const job = jobs[id];
            if (!job) return null;
            const color = statusColors[job.status] || "#aaa";

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${color}44`,
                  borderRadius: "14px",
                  padding: "1.5rem",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <span style={{ color: "#666", fontSize: "0.75rem" }}>
                      JOB ID
                    </span>
                    <p style={{ color: "#fff", fontWeight: 600, margin: 0 }}>
                      #{id}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: `${color}22`,
                      border: `1px solid ${color}44`,
                      borderRadius: "20px",
                      padding: "0.3rem 0.8rem",
                    }}
                  >
                    <span>{statusIcons[job.status]}</span>
                    <span
                      style={{
                        color,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: job.result ? "1rem" : 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <span style={{ color: "#aaa", fontSize: "0.8rem" }}>
                      Progress
                    </span>
                    <span
                      style={{ color, fontSize: "0.8rem", fontWeight: 600 }}
                    >
                      {job.progress}%
                    </span>
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                      height: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      animate={{ width: `${job.progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                </div>

                {/* Result */}
                {job.result && <ResultCard result={job.result} />}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
