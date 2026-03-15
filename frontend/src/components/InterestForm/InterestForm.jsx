import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function InterestForm({ step, onClose }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    setStatus("loading");
    try {
      await axios.post("http://localhost:5000/api/interest", {
        name: form.name,
        email: form.email,
        selectedStep: step.title,
      });
      setStatus("success");
      setTimeout(onClose, 2000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1a1a2e",
          border: "1px solid rgba(108,99,255,0.4)",
          borderRadius: "20px",
          padding: "2.5rem",
          width: "90%",
          maxWidth: "420px",
          boxShadow: "0 25px 80px rgba(108,99,255,0.3)",
        }}
      >
        <h2 style={{ color: "#fff", marginBottom: "0.5rem" }}>
          I'm Interested
        </h2>
        <p
          style={{ color: "#aaa", marginBottom: "1.5rem", fontSize: "0.9rem" }}
        >
          Selected: <strong style={{ color: "#6C63FF" }}>{step.title}</strong>
        </p>

        {status === "success" ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ textAlign: "center", padding: "1rem" }}
          >
            <div style={{ fontSize: "3rem" }}>✅</div>
            <p
              style={{ color: "#11998E", fontWeight: 600, marginTop: "0.5rem" }}
            >
              Registered successfully!
            </p>
          </motion.div>
        ) : (
          <>
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
              style={{ ...inputStyle, marginTop: "1rem" }}
            />

            {status === "error" && (
              <p
                style={{
                  color: "#F64F59",
                  fontSize: "0.85rem",
                  marginTop: "0.5rem",
                }}
              >
                Something went wrong. Please try again.
              </p>
            )}

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={status === "loading"}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #6C63FF, #a78bfa)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                {status === "loading" ? "Submitting..." : "Submit"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                style={{
                  flex: 1,
                  background: "transparent",
                  color: "#aaa",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "0.8rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Cancel
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  padding: "0.75rem 1rem",
  color: "#fff",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};
