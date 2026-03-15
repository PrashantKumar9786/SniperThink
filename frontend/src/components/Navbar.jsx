import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#6C63FF" : "#aaa",
    textDecoration: "none",
    fontWeight: isActive ? 700 : 400,
    fontSize: "0.95rem",
    padding: "0.4rem 1rem",
    borderRadius: "20px",
    background: isActive ? "rgba(108,99,255,0.15)" : "transparent",
    transition: "all 0.3s ease",
  });

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        background: "rgba(13,13,26,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: "1.2rem",
          letterSpacing: "1px",
        }}
      >
        Sniper<span style={{ color: "#6C63FF" }}>Think</span>
      </span>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <NavLink to="/" style={linkStyle} end>
          Strategy
        </NavLink>
        <NavLink to="/dashboard" style={linkStyle}>
          File Dashboard
        </NavLink>
      </div>
    </motion.nav>
  );
}
