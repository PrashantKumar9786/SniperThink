import { motion } from "framer-motion";

export default function ResultCard({ result }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        marginTop: "1rem",
        background: "rgba(17,153,142,0.08)",
        border: "1px solid rgba(17,153,142,0.3)",
        borderRadius: "12px",
        padding: "1.5rem",
      }}
    >
      <p
        style={{
          color: "#11998E",
          fontWeight: 700,
          marginBottom: "1rem",
          fontSize: "0.9rem",
          letterSpacing: "1px",
        }}
      >
        PROCESSING RESULTS
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={statBox}>
          <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>
            {result.wordCount?.toLocaleString()}
          </span>
          <span style={{ color: "#aaa", fontSize: "0.8rem" }}>Total Words</span>
        </div>
        <div style={statBox}>
          <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>
            {result.paragraphCount}
          </span>
          <span style={{ color: "#aaa", fontSize: "0.8rem" }}>Paragraphs</span>
        </div>
      </div>
      <div>
        <p
          style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: "0.6rem" }}
        >
          Top Keywords
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {result.topKeywords?.map((kw, i) => (
            <motion.span
              key={kw}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: "rgba(108,99,255,0.2)",
                border: "1px solid rgba(108,99,255,0.4)",
                color: "#a78bfa",
                borderRadius: "20px",
                padding: "0.3rem 0.8rem",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              #{kw}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const statBox = {
  background: "rgba(255,255,255,0.04)",
  borderRadius: "10px",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.3rem",
};
