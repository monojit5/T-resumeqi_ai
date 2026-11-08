import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import HowItWorks from "../components/HowItWorks";
import Navber from "../components/Navber";

function HowToWork() {
  return (
    <main className="home standalone-page">
      <Navber />

      <section className="inner-page-hero how-page-hero">
        <motion.div
          className="inner-page-hero-content"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="tag">
            <Sparkles size={16} />
            YOUR CAREER, ONE STEP AT A TIME
          </span>
          <h1>
            A clearer path to
            <span> a resume you feel good about.</span>
          </h1>
          <p>
            Upload your resume, explore your personalized insights, and use
            practical suggestions to keep moving forward.
          </p>
        </motion.div>
      </section>

      <HowItWorks />

      <section className="inner-page-cta">
        <h2>Ready to take your first step?</h2>
        <Link to="/register" className="primary-btn">
          Start improving your resume <ArrowRight size={17} />
        </Link>
      </section>

      <footer className="home-footer">
        <Brand />
        <p>© {new Date().getFullYear()} T-ResumeIQ. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default HowToWork;
