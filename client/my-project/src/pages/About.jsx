
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  Eye,
  BrainCircuit,
  ShieldCheck,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Rocket,
  Heart,
} from "lucide-react";

import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import Navber from "../components/Navber";


const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 45 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const values = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Intelligence",
    description:
      "Smart resume insights help you understand your strengths and identify opportunities for improvement.",
    color: "purple",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "Your career information deserves care. We aim to keep your resume data secure and private.",
    color: "blue",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Get practical recommendations that help you improve your professional profile.",
    color: "pink",
  },
  {
    icon: Lightbulb,
    title: "Simple & Useful",
    description:
      "Clear insights and actionable suggestions without unnecessary complexity.",
    color: "orange",
  },
];

function About() {
  return (
    <div className="about-page">

      <Navber />

      {/* HERO */}
      <section className="about-hero">

        <div className="about-glow about-glow-one" />
        <div className="about-glow about-glow-two" />

        <motion.div
          className="about-hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="about-badge" variants={fadeUp}>
            <Sparkles size={16} />
            GET TO KNOW US
          </motion.span>

          <motion.h1 variants={fadeUp}>
            Empowering Careers,
            <br />
            <span>One Resume at a Time.</span>
          </motion.h1>

          <motion.p variants={fadeUp}>
            We believe every professional deserves an opportunity
            to shine. TotaResumeIQ helps you understand your resume,
            discover your potential and take confident career steps.
          </motion.p>

          <motion.div className="about-hero-buttons" variants={fadeUp}>
            <Link to="/register" className="about-primary-btn">
              Explore Your Potential
              <ArrowRight size={18} />
            </Link>

            <Link to="/how-it-works" className="about-secondary-btn">
              How It Works
            </Link>
          </motion.div>
        </motion.div>

        {/* HERO VISUAL */}
        <motion.div
          className="about-hero-visual"
          initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="about-visual-glow" />

          <motion.div
            className="about-main-illustration"
            animate={{ y: [0, -13, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="about-illustration-icon">
              <BrainCircuit size={58} />
            </div>

            <h3>YOUR CAREER</h3>
            <h2>Potential Unlocked</h2>

            <div className="about-illustration-line" />
            <div className="about-illustration-line short" />

            <div className="about-illustration-tags">
              <span>Skills</span>
              <span>Experience</span>
              <span>Growth</span>
            </div>

            <div className="about-illustration-bottom">
              <Sparkles size={19} />
              Intelligent Career Insights
            </div>
          </motion.div>

          <motion.div
            className="about-floating-card floating-top"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Target size={22} />
            <div>
              <b>Clear Direction</b>
              <small>Know your next step</small>
            </div>
          </motion.div>

          <motion.div
            className="about-floating-card floating-bottom"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          >
            <TrendingUp size={22} />
            <div>
              <b>Keep Growing</b>
              <small>Build your future</small>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* INTRODUCTION */}
      <section className="about-intro">
        <motion.div
          className="about-intro-left"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span>WHO WE ARE</span>
          <h2>
            More Than Just
            <br />
            <span>A Resume Tool.</span>
          </h2>
        </motion.div>

        <motion.div
          className="about-intro-right"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p>
            TotaResumeIQ is designed to make resume improvement
            easier and more meaningful. We combine AI-powered
            analysis with practical career guidance to help
            job seekers understand what their resumes communicate.
          </p>

          <p>
            From identifying skill gaps to improving ATS readiness,
            our goal is to turn confusing resume feedback into
            clear and useful next steps.
          </p>
        </motion.div>
      </section>

      {/* MISSION AND VISION */}
      <section className="mission-section">
        <motion.div
          className="about-section-heading"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span>OUR PURPOSE</span>
          <h2>
            What Drives <span>Us Forward</span>
          </h2>
          <p>Our purpose is simple: help people move forward.</p>
        </motion.div>

        <div className="mission-grid">
          <motion.div
            className="mission-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -12 }}
          >
            <div className="mission-icon">
              <Target size={30} />
            </div>

            <span>OUR MISSION</span>

            <h3>Make Career Growth More Accessible.</h3>

            <p>
              To help job seekers understand their professional
              strengths, improve their resumes and prepare for
              better career opportunities through useful AI tools.
            </p>

            <div className="mission-decoration">
              <Target size={100} />
            </div>
          </motion.div>

          <motion.div
            className="mission-card vision-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -12 }}
          >
            <div className="mission-icon">
              <Eye size={30} />
            </div>

            <span>OUR VISION</span>

            <h3>A Future Where Every Skill Gets Recognized.</h3>

            <p>
              We envision a world where technology helps people
              present their abilities clearly and pursue
              opportunities with greater confidence.
            </p>

            <div className="mission-decoration">
              <Eye size={100} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="values-section">
        <motion.div
          className="about-section-heading"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span>WHAT MAKES US DIFFERENT</span>
          <h2>
            Built Around <span>Your Growth</span>
          </h2>
          <p>Useful technology, thoughtful guidance and a clear purpose.</p>
        </motion.div>

        <motion.div
          className="values-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <motion.div
                className={`value-card ${value.color}`}
                key={value.title}
                variants={fadeUp}
                whileHover={{
                  y: -10,
                  scale: 1.025,
                }}
              >
                <div className="value-icon">
                  <Icon size={27} />
                </div>

                <span>0{index + 1}</span>

                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* OUR COMMITMENT */}
      <section className="commitment-section">
        <motion.div
          className="commitment-content"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="commitment-icon">
            <Heart size={32} />
          </div>

          <span>OUR COMMITMENT</span>

          <h2>
            Your Journey.
            <br />
            <span>Your Potential. Your Future.</span>
          </h2>

          <p>
            We want to make career improvement feel less
            overwhelming and more achievable. Every resume
            has a story, and we want to help you tell yours better.
          </p>

          <Link to="/register" className="about-primary-btn">
            Start Improving Your Resume
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <motion.div
          className="about-cta-box"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Rocket size={38} />

          <h2>Ready to Take the Next Step?</h2>

          <p>
            Start understanding your resume and discover
            opportunities to grow.
          </p>

          <Link to="/register" className="about-primary-btn">
            Get Started Free
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="about-footer">
        <Brand />

        <p>
          © {new Date().getFullYear()} TotaResumeIQ.
          All rights reserved.
        </p>

        <Link to="/">Back to Home</Link>
      </footer>
    </div>
  );
}

export default About;
