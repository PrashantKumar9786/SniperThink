import { motion } from "framer-motion";

export default function ProgressIndicator({ total, active }) {
  return (
    <div
      style={{
        position: "fixed",
        right: "2rem",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 100,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: active === i ? 1.4 : 1,
            backgroundColor: active === i ? "#6C63FF" : "#ccc",
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );
}
