import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";

// Each step gets a unique animation based on its index
const animationVariants = [
  { hidden: { opacity: 0, x: -120 }, visible: { opacity: 1, x: 0 } }, // slide from left
  { hidden: { opacity: 0, y: 100 }, visible: { opacity: 1, y: 0 } }, // slide from bottom
  { hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1 } }, // scale up
  { hidden: { opacity: 0, x: 120 }, visible: { opacity: 1, x: 0 } }, // slide from right
];

export default function StepCard({ step, index, onVisible, onInterested }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.4,
    triggerOnce: false,
    onChange: (inView) => {
      if (inView) onVisible(index);
    },
  });

  const variant = animationVariants[index % animationVariants.length];

  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${step.color}22, ${step.color}44)`
          : "rgba(255,255,255,0.04)",
        border: `2px solid ${hovered ? step.color : "rgba(255,255,255,0.1)"}`,
        borderRadius: "20px",
        padding: "2.5rem",
        marginBottom: "6rem",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        boxShadow: hovered
          ? `0 20px 60px ${step.color}33`
          : "0 4px 20px rgba(0,0,0,0.2)",
        transition: "box-shadow 0.3s ease",
        maxWidth: "680px",
        margin: "0 auto 6rem auto",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Step number + icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <motion.div
          animate={{ rotate: hovered ? 360 : 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "2.5rem",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${step.color}22`,
            borderRadius: "50%",
          }}
        >
          {step.icon}
        </motion.div>
        <div>
          <p
            style={{
              color: step.color,
              fontWeight: 700,
              margin: 0,
              fontSize: "0.85rem",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Step {step.id}
          </p>
          <h3
            style={{
              margin: 0,
              fontSize: "1.5rem",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {step.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: "#ccc", lineHeight: 1.7, marginBottom: "1rem" }}>
        {step.description}
      </p>

      {/* Expandable detail on click */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ overflow: "hidden" }}
      >
        <p
          style={{
            color: "#aaa",
            fontSize: "0.95rem",
            borderLeft: `3px solid ${step.color}`,
            paddingLeft: "1rem",
            marginBottom: "1rem",
          }}
        >
          {step.detail}
        </p>
      </motion.div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: step.color, fontSize: "0.85rem" }}>
          {expanded ? "▲ Show less" : "▼ Click to expand"}
        </span>
        {/* I'm Interested button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onInterested(step);
          }}
          style={{
            background: `linear-gradient(135deg, ${step.color}, ${step.color}aa)`,
            color: "#fff",
            border: "none",
            borderRadius: "25px",
            padding: "0.6rem 1.4rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          I'm Interested
        </motion.button>
      </div>
    </motion.div>
  );
}
