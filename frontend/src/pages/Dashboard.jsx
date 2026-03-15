import { useState } from "react";
import { motion } from "framer-motion";
import FileUpload from "../components/FileUpload/FileUpload";
import JobTracker from "../components/FileUpload/JobTracker";

export default function Dashboard() {
  const [jobIds, setJobIds] = useState([]);

  const handleJobCreated = (id) => {
    setJobIds((prev) => [id, ...prev]);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d1a",
        paddingTop: "6rem",
        paddingBottom: "4rem",
      }}
    >
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <p
            style={{
              color: "#6C63FF",
              letterSpacing: "3px",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            File Processing System
          </p>
          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              margin: "1.4rem 1",
            }}
          >
            Upload & Analyze Files
          </h1>
          <p style={{ color: "#aaa", lineHeight: 1.7 }}>
            Upload a PDF or TXT file. Our background workers will extract word
            counts, paragraph counts, and top keywords automatically.
          </p>
        </motion.div>

        {/* How it works pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "flex",
            gap: "0.7rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          {[
            { icon: "📤", label: "Upload File" },
            { icon: "➡️", label: "Job Created" },
            { icon: "⚙️", label: "Worker Processes" },
            { icon: "📊", label: "Results Ready" },
          ].map((pill, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "rgba(108,99,255,0.1)",
                border: "1px solid rgba(108,99,255,0.25)",
                borderRadius: "20px",
                padding: "0.35rem 0.9rem",
                fontSize: "0.82rem",
                color: "#a78bfa",
              }}
            >
              {pill.icon} {pill.label}
            </div>
          ))}
        </motion.div>

        {/* Upload Form */}
        <FileUpload onJobCreated={handleJobCreated} />

        {/* Job Tracker */}
        <JobTracker jobIds={jobIds} />
      </div>
    </div>
  );
}
