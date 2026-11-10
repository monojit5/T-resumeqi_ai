import { useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  FileText,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link, Navigate, useLocation } from "react-router-dom";
import Brand from "../components/Brand";
import Navber from "../components/Navber";
import TanujaChatbot from "../components/TanujaChatbot";
import ResumeRewriteReveal from "../components/ResumeRewriteReveal";
import { SubscriptionContext } from "../context/SubscriptionContext";

const SCORE_COLORS = ["#ec79a6", "#b77aba", "#e7a36f", "#83b9aa"];

function ScoreCard({ label, score, icon: Icon, tone }) {
  return (
    <motion.article
      className={`analysis-score-card ${tone}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="analysis-score-card-top">
        <span className="analysis-score-icon"><Icon size={18} /></span>
        <span>{label}</span>
      </div>
      <strong>{score}<small>/100</small></strong>
      <div className="analysis-score-track"><span style={{ width: `${score}%` }} /></div>
    </motion.article>
  );
}

function ResumeDashboard() {
  const location = useLocation();
  const { isPremium, plan } = useContext(SubscriptionContext);
  const [showResumeReveal, setShowResumeReveal] = useState(false);
  const storedResult = useMemo(() => {
    if (location.state?.analysis) return location.state;
    try {
      return JSON.parse(sessionStorage.getItem("resumeAnalysis") || "null");
    } catch {
      return null;
    }
  }, [location.state]);

  if (!storedResult?.analysis) {
    return <Navigate to="/resume-check" replace />;
  }

  const { analysis, fileName, analyzedAt } = storedResult;
  const chartData = analysis.scoreBreakdown || [];
  const analyzedDate = analyzedAt
    ? new Date(analyzedAt).toLocaleDateString(undefined, { dateStyle: "medium" })
    : "Just now";

  return (
    <main className="home resume-tool-page">
      <Navber />
      <div className="analysis-dashboard">
        <motion.header
          className="analysis-dashboard-header"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <Link to="/resume-check" className="analysis-back-link">
              <ArrowLeft size={16} /> Analyze another resume
            </Link>
            <span className="resume-eyebrow"><Sparkles size={15} /> YOUR RESUME SNAPSHOT</span>
            <h1>Your resume, <span>decoded.</span></h1>
            <p>A practical snapshot of your ATS readiness and resume quality.</p>
            <Link to="/pricing" className={`analysis-plan-badge${isPremium ? " premium" : ""}`}>
              {isPremium ? "PREMIUM PLAN · UNLIMITED AI" : `FREE PLAN · ${plan.monthlyAiLimit} AI ANALYSES/MONTH`}
            </Link>
          </div>
          <div className="analysis-file-chip">
            <FileText size={17} />
            <span><strong>{fileName || "Resume PDF"}</strong><small>Reviewed {analyzedDate}</small></span>
          </div>
        </motion.header>

        <section className="analysis-score-grid">
          <ScoreCard label="ATS readiness" score={analysis.atsScore} icon={Target} tone="rose" />
          <ScoreCard label="Resume quality" score={analysis.qualityScore} icon={Sparkles} tone="mauve" />
          <ScoreCard label="Overall score" score={analysis.overallScore} icon={TrendingUp} tone="peach" />
          <motion.article
            className="analysis-overall-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <div>
              <span className="resume-eyebrow">YOUR CURRENT SCORE</span>
              <strong>{analysis.overallScore}<small>/100</small></strong>
              <p>Use the recommendations below to strengthen your next draft.</p>
            </div>
            <div className="analysis-radial-chart">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={[{ value: analysis.overallScore }]}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="76%"
                  outerRadius="100%"
                  barSize={13}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={10} fill="#df78a0" background={{ fill: "rgba(160, 120, 145, .14)" }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <span>{analysis.overallScore}</span>
            </div>
          </motion.article>
        </section>

        <section className="analysis-detail-grid">
          <motion.article
            className="analysis-panel analysis-breakdown-panel"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="analysis-panel-heading">
              <div><span className="analysis-panel-kicker">AT A GLANCE</span><h2>Resume breakdown</h2></div>
              <span className="analysis-panel-mark"><TrendingUp size={18} /></span>
            </div>
            <p className="analysis-summary">{analysis.summary}</p>
            <div className="analysis-bar-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 12, bottom: 4, left: 8 }}>
                  <CartesianGrid stroke="rgba(160, 130, 150, .12)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "#987f8e", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" width={94} tick={{ fill: "#987f8e", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "rgba(230, 160, 190, .08)" }} contentStyle={{ borderRadius: 12, border: "1px solid rgba(201, 111, 151, .2)" }} />
                  <Bar dataKey="score" name="Score" radius={[0, 7, 7, 0]} barSize={15}>
                    {chartData.map((item, index) => (
                      <Cell key={item.label} fill={SCORE_COLORS[index % SCORE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.article>

          <motion.article
            className="analysis-panel analysis-strengths-panel"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            <div className="analysis-panel-heading">
              <div><span className="analysis-panel-kicker">WHAT'S WORKING</span><h2>Your strengths</h2></div>
              <span className="analysis-panel-mark"><CheckCircle2 size={18} /></span>
            </div>
            <ul className="analysis-strength-list">
              {analysis.strengths.map((strength, index) => (
                <li key={`${strength}-${index}`}><CheckCircle2 size={17} />{strength}</li>
              ))}
            </ul>
          </motion.article>
        </section>

        <section className="analysis-improvements-section" id="analysis-improvements">
          <div className="analysis-improvements-heading">
            <span className="resume-eyebrow"><Sparkles size={15} /> YOUR NEXT BEST MOVES</span>
            <h2>Small edits, <span>stronger impact.</span></h2>
            <p>Focus on these evidence-based suggestions to improve your next version.</p>
          </div>
          <div className="analysis-improvement-grid">
            {analysis.improvements.map((item, index) => (
              <motion.article
                className="analysis-improvement-card"
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06 }}
              >
                <div className="improvement-card-top">
                  <span className="improvement-number">0{index + 1}</span>
                  <span className={`improvement-impact ${String(item.impact).toLowerCase()}`}>
                    <CircleAlert size={13} /> {item.impact} impact
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="improvement-arrow"><ArrowUpRight size={17} /></span>
              </motion.article>
            ))}
          </div>
        </section>

        <div className="analysis-disclaimer">
          <Sparkles size={16} />
          This is an AI-generated estimate for general guidance, not a guarantee of how a specific employer's ATS will score your resume.
        </div>
      </div>

      <footer className="home-footer">
        <Brand />
        <p>© {new Date().getFullYear()} T-ResumeIQ. All rights reserved.</p>
      </footer>
      <TanujaChatbot onStartHelping={() => setShowResumeReveal(true)} />
      <AnimatePresence>
        {showResumeReveal && (
          <ResumeRewriteReveal
            analysis={analysis}
            fileName={fileName}
            onClose={() => setShowResumeReveal(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default ResumeDashboard;
