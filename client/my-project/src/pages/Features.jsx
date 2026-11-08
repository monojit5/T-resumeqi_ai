import { motion } from "framer-motion";
import {
  ArrowRight,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import Navber from "../components/Navber";

const features = [
  {
    icon: ScanSearch,
    title: "Smart Resume Analysis",
    description:
      "Get clear, AI-powered feedback on your resume's strengths and the areas you can improve.",
  },
  {
    icon: Target,
    title: "ATS Readiness",
    description:
      "Understand how your resume may perform with applicant tracking systems and spot missing details.",
  },
  {
    icon: TrendingUp,
    title: "Personalized Career Growth",
    description:
      "Turn your analysis into practical next steps for improving your skills and professional profile.",
  },
  {
    icon: ShieldCheck,
    title: "Thoughtful Privacy",
    description:
      "Your career information matters. We design the experience with care for your personal data.",
  },
];

function Features() {
  return (
    <main className="home standalone-page">
      <Navber />

      <section className="inner-page-hero">
        <motion.div
          className="inner-page-hero-content"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="tag">
            <Sparkles size={16} />
            TOOLS FOR YOUR NEXT CAREER STEP
          </span>
          <h1>
            Everything you need to
            <span> make your resume stronger.</span>
          </h1>
          <p>
            Practical insights, clear recommendations, and a more confident
            way to tell your professional story.
          </p>
          <Link to="/register" className="primary-btn big-btn">
            Get Started <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <section className="features-section standalone-features">
        <div className="section-title">
          <span>MADE TO MOVE YOU FORWARD</span>
          <h2>
            Small insights.
            <br />
            <span>Meaningful progress.</span>
          </h2>
          <p>Explore the tools that help turn your resume into a stronger story.</p>
        </div>

        <div className="features-grid">
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.article
              className="feature-card"
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <div className="feature-icon"><Icon size={27} /></div>
              <span className="feature-index">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <Brand />
        <p>© {new Date().getFullYear()} T-ResumeIQ. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default Features;
