
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

import {
  UploadCloud,
  ScanSearch,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload Resume",
    description:
      "Upload your resume in PDF format and let us understand your professional profile.",
    icon: UploadCloud,
    color: "blue",
    tag: "START HERE",
    features: ["PDF Upload", "Secure Processing"],
  },
  {
    number: "02",
    title: "Get AI Analysis",
    description:
      "Discover your strengths, identify skill gaps and get an in-depth resume analysis.",
    icon: ScanSearch,
    color: "purple",
    tag: "SMART ANALYSIS",
    features: ["ATS Score", "Skill Detection"],
  },
  {
    number: "03",
    title: "Improve & Grow",
    description:
      "Follow personalized AI suggestions and take the next step in your career.",
    icon: TrendingUp,
    color: "pink",
    tag: "YOUR SUCCESS",
    features: ["Career Tips", "Growth Plan"],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 100,
    rotateX: 18,
    scale: 0.85,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function AnimatedCard({ step, index, reduceMotion }) {
  const Icon = step.icon;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, {
    stiffness: 180,
    damping: 18,
  });

  const springY = useSpring(mouseY, {
    stiffness: 180,
    damping: 18,
  });

  const rotateX = useTransform(springY, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-9, 9]);

  const handleMouseMove = (event) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();

    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className={`step-card ${step.color}`}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={
        reduceMotion
          ? {}
          : {
              y: -15,
              scale: 1.025,
              transition: {
                type: "spring",
                stiffness: 250,
                damping: 17,
              },
            }
      }
    >
      <div className="card-glow" />

      <div className="step-top">
        <span className="step-number">{step.number}</span>

        <motion.div
          className="step-tag"
          animate={
            reduceMotion
              ? {}
              : {
                  opacity: [0.65, 1, 0.65],
                }
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
          }}
        >
          {step.tag}
        </motion.div>

        <ArrowUpRight className="step-arrow" size={21} />
      </div>

      <motion.div
        className="step-icon"
        animate={
          reduceMotion
            ? {}
            : {
                y: [0, -8, 0],
                rotate: [0, 4, -4, 0],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: index * 0.4,
          ease: "easeInOut",
        }}
      >
        <Icon size={32} strokeWidth={1.7} />
        <div className="icon-orbit" />
      </motion.div>

      <h3>{step.title}</h3>

      <p>{step.description}</p>

      <div className="step-features">
        {step.features.map((feature) => (
          <span key={feature}>
            <CheckCircle2 size={14} />
            {feature}
          </span>
        ))}
      </div>

      <div className="step-progress">
        <motion.span
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{
            duration: 1.5,
            delay: 0.5 + index * 0.3,
            ease: "easeOut",
          }}
        />
      </div>
    </motion.div>
  );
}

function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="how-section" id="how">
      {!reduceMotion && (
        <>
          <div className="how-orb orb-one" />
          <div className="how-orb orb-two" />
          <div className="how-orb orb-three" />
        </>
      )}

      <motion.div
        className="section-title"
        initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
        whileInView={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="how-label"
          animate={
            reduceMotion
              ? {}
              : {
                  scale: [1, 1.04, 1],
                }
          }
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <Sparkles size={15} />
          HOW IT WORKS
        </motion.div>

        <h2>
          Three Simple Steps to
          <br />
          <span>Career Success</span>
        </h2>

        <p>
          Your career improvement journey starts here.
          Let AI help you unlock your potential.
        </p>
      </motion.div>

      <motion.div
        className="step-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {steps.map((step, index) => (
          <AnimatedCard
            key={step.number}
            step={step}
            index={index}
            reduceMotion={reduceMotion}
          />
        ))}
      </motion.div>

      <motion.div
        className="how-bottom-text"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Sparkles size={16} />
        Your next opportunity starts with a better resume.
      </motion.div>
    </section>
  );
}

export default HowItWorks;
