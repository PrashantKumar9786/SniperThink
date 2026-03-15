import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { steps } from "../../data/steps";
import StepCard from "./StepCard";
import ProgressIndicator from "./ProgressIndicator";
import InterestForm from "../InterestForm/InterestForm";
import { useScrollProgress } from "../../hooks/useScrollProgress";

export default function StrategyFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const scrollProgress = useScrollProgress();

  return (
    <section
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0d0d1a 0%, #1a0a2e 50%, #0d0d1a 100%)",
        padding: "6rem 1.5rem",
        position: "relative",
      }}
    >
      {/* Scroll progress bar at top */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "4px",
          background: "linear-gradient(90deg, #6C63FF, #F64F59, #F7971E)",
          width: `${scrollProgress}%`,
          zIndex: 999,
        }}
      />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: "5rem" }}
      >
        <p
          style={{
            color: "#6C63FF",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontSize: "0.85rem",
            fontWeight: 700,
          }}
        >
          How It Works
        </p>
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#fff",
            fontWeight: 800,
            margin: "0.5rem 0",
          }}
        >
          The SniperThink Strategy
        </h2>
        <p
          style={{
            color: "#aaa",
            maxWidth: "500px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          A proven four-step process that transforms ideas into results. Scroll
          through each step to discover how it works.
        </p>
      </motion.div>

      {/* Step Cards */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            onVisible={setActiveStep}
            onInterested={setSelectedStep}
          />
        ))}
      </div>

      {/* Fixed progress dots */}
      <ProgressIndicator total={steps.length} active={activeStep} />

      {/* Interest form modal */}
      <AnimatePresence>
        {selectedStep && (
          <InterestForm
            step={selectedStep}
            onClose={() => setSelectedStep(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
