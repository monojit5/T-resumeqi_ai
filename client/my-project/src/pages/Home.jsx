
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Check,
  ScanSearch,
  TrendingUp,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import HowItWorks from "../components/HowItWorks";
import Navber from "../components/Navber";


const features = [
  {
    icon: ScanSearch,
    title: "Smart Resume Analysis",
    description: "Understand your resume with detailed AI-powered insights.",
  },
  {
    icon: Target,
    title: "ATS Score Tracking",
    description: "Discover how well your resume matches ATS requirements.",
  },
  {
    icon: TrendingUp,
    title: "Career Improvement",
    description: "Get actionable suggestions to grow your career.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 55 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
};

function Home() {
  return (
    <div className="home">

    <Navber/>
    

      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-background-glow hero-glow-one" />
        <div className="hero-background-glow hero-glow-two" />

        <motion.div
          className="hero-content"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="tag" variants={fadeUp}>
            <Sparkles size={16} />
            AI POWERED RESUME ANALYZER
          </motion.span>

          <motion.h1 variants={fadeUp}>
            Make Your Resume
            <span> Stand Out With AI.</span>
          </motion.h1>

          <motion.p variants={fadeUp}>
            Analyze your resume, discover missing skills,
            improve your ATS readiness and move closer
            to your dream career.
          </motion.p>

          <motion.div className="hero-buttons" variants={fadeUp}>
            <Link to="/resume-check" className="primary-btn big-btn">
              Check Resume ATS <ArrowRight size={18} />
            </Link>

            <a href="#features" className="watch-btn">
              Explore Features <ArrowRight size={16} />
            </a>
          </motion.div>

          <motion.div className="hero-trust" variants={fadeUp}>
            <span><Check size={16} /> AI Insights</span>
            <span><Check size={16} /> ATS Analysis</span>
            <span><Check size={16} /> Career Guidance</span>
          </motion.div>

          <motion.div className="hero-users" variants={fadeUp}>
            <div className="user-avatars">
              <span>J</span>
              <span>A</span>
              <span>M</span>
              <span>+</span>
            </div>
            <p>
              Built to help you take your
              <strong> career forward.</strong>
            </p>
          </motion.div>
        </motion.div>

        {/* HERO VISUAL */}
        <motion.div
          className="hero-art"
          initial={{ opacity: 0, scale: 0.75, x: 70 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 1.1,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.div
            className="hero-orbit orbit-one"
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className="hero-orbit orbit-two"
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          />

          <div className="glow" />

          <motion.div
            className="resume-card"
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="resume-heading">
              <div className="avatar">JD</div>
              <div>
                <h3>JOHN DOE</h3>
                <small>FULL STACK DEVELOPER</small>
              </div>
              <ShieldCheck className="resume-shield" size={23} />
            </div>

            <h4>PROFILE SUMMARY</h4>
            <div className="line" />
            <div className="line short" />

            <h4>EXPERIENCE</h4>
            <div className="line" />
            <div className="line" />
            <div className="line short" />

            <h4>TECHNICAL SKILLS</h4>
            <div className="skills">
              <span>React</span>
              <span>Node.js</span>
              <span>MongoDB</span>
            </div>

            <h4>EDUCATION</h4>
            <div className="line" />
          </motion.div>

          <motion.div
            className="score-card"
            animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="score-circle">
              <strong>92</strong>
              <small>/100</small>
            </div>

            <div>
              <b>ATS Score</b>
              <p>Excellent Profile</p>
            </div>

            <Check className="score-check" />
          </motion.div>

          <motion.div
            className="ai-card"
            animate={{ y: [0, 12, 0], rotate: [0, -2, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <div className="ai-card-icon">
              <Sparkles size={21} />
            </div>
            <div>
              <b>AI Insights</b>
              <p>3 improvements found</p>
            </div>
          </motion.div>

          <motion.div
            className="floating-badge"
            animate={{ y: [0, -9, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap size={16} />
            Smart Analysis
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section" id="features">
        <motion.div
          className="section-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span>POWERFUL FEATURES</span>
          <h2>
            Everything You Need to
            <br />
            <span>Build a Better Career</span>
          </h2>
          <p>Smart tools to make your next career move easier.</p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                className="feature-card"
                key={feature.title}
                variants={fadeUp}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className="feature-icon"
                  whileHover={{ rotate: 12, scale: 1.15 }}
                >
                  <Icon size={27} />
                </motion.div>

                <span className="feature-index">
                  0{index + 1}
                </span>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
       
      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* ABOUT SECTION */}
      <section className="about-section" id="about">
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span>ABOUT T-RESUMEIQ</span>
          <h2>
            Your Skills Deserve
            <br />
            <span>To Be Recognized.</span>
          </h2>
          <p>
            We help job seekers understand their resumes,
            identify improvement areas and prepare for
            better career opportunities with intelligent tools.
          </p>

          <Link to="/register" className="primary-btn big-btn">
            Start Your Journey <ArrowRight size={17} />
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <Brand />
        <p>
          © {new Date().getFullYear()} T-ResumeIQ.
          All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default Home;
