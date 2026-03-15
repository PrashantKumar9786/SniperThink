import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function FileUpload({ onJobCreated }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ["application/pdf", "text/plain"];
    if (!allowed.includes(f.type)) {
      setErrorMsg("Only PDF and TXT files are allowed.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg("File size must be under 10MB.");
      return;
    }
    setErrorMsg("");
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !form.name || !form.email) {
      setErrorMsg("Please fill in all fields and select a file.");
      return;
    }
    setStatus("loading");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", form.name);
      formData.append("email", form.email);

      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
      );
      setStatus("success");
      onJobCreated(res.data.jobId);
      setFile(null);
      setForm({ name: "", email: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Upload failed. Try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "20px",
        padding: "2.5rem",
      }}
    >
      <h3
        style={{
          color: "#fff",
          marginBottom: "1.5rem",
          fontSize: "1.3rem",
          fontWeight: 700,
        }}
      >
        Upload File for Processing
      </h3>

      {/* Name + Email */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <input
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Your Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
        />
      </div>

      {/* Drag & Drop Zone */}
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        animate={{
          borderColor: dragging
            ? "#6C63FF"
            : file
              ? "#11998E"
              : "rgba(255,255,255,0.15)",
          background: dragging
            ? "rgba(108,99,255,0.08)"
            : "rgba(255,255,255,0.02)",
        }}
        style={{
          border: "2px dashed rgba(255,255,255,0.15)",
          borderRadius: "14px",
          padding: "2.5rem",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: "1.5rem",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          {file ? "✅" : "📁"}
        </div>
        <p
          style={{
            color: file ? "#11998E" : "#aaa",
            fontWeight: file ? 600 : 400,
          }}
        >
          {file
            ? file.name
            : "Drag & drop or click to select a PDF or TXT file"}
        </p>
        {file && (
          <p style={{ color: "#666", fontSize: "0.8rem", marginTop: "0.3rem" }}>
            {(file.size / 1024).toFixed(1)} KB
          </p>
        )}
        {!file && (
          <p style={{ color: "#555", fontSize: "0.8rem", marginTop: "0.3rem" }}>
            Max file size: 10MB
          </p>
        )}
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              color: "#F64F59",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            ⚠️ {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={status === "loading"}
        style={{
          width: "100%",
          background:
            status === "success"
              ? "linear-gradient(135deg, #11998E, #38ef7d)"
              : "linear-gradient(135deg, #6C63FF, #a78bfa)",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          padding: "0.9rem",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.8 : 1,
        }}
      >
        {status === "loading"
          ? " Uploading..."
          : status === "success"
            ? " Uploaded!"
            : "Upload & Process"}
      </motion.button>
    </motion.div>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  padding: "0.75rem 1rem",
  color: "#fff",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box",
};
