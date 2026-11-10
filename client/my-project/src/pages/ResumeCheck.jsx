import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileCheck2, FileText, LockKeyhole, Sparkles, UploadCloud, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Brand from "../components/Brand";
import Navber from "../components/Navber";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { SubscriptionContext } from "../context/SubscriptionContext";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function ResumeCheck() {
  const { auth, handleSessionExpired } = useContext(UserContext);
  const { isPremium, plan, usage, loadSubscription } = useContext(SubscriptionContext);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const canAnalyze = isPremium || usage.aiAnalysesUsed < plan.monthlyAiLimit;

  const chooseFile = (candidate) => {
    if (!candidate) return;
    if (candidate.type !== "application/pdf" && !candidate.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please choose a PDF file.");
      return;
    }
    if (candidate.size > MAX_FILE_SIZE) {
      toast.error("The PDF must be smaller than 10 MB.");
      return;
    }
    setFile(candidate);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!auth?.token) {
      handleSessionExpired();
      return;
    }
    if (!file) {
      toast.error("Upload your resume PDF first.");
      return;
    }
    if (!canAnalyze) {
      toast.error("You have reached the Free plan's monthly AI analysis limit.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    setAnalyzing(true);

    try {
      const response = await axios.post(`${API_URL}/resume/analyze`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        timeout: 120000,
      });
      const result = {
        analysis: response.data.analysis,
        fileName: file.name,
        analyzedAt: new Date().toISOString(),
      };
      await loadSubscription();
      sessionStorage.setItem("resumeAnalysis", JSON.stringify(result));
      navigate("/resume-dashboard", { state: result });
    } catch (error) {
      if (error.response?.status === 401) {
        handleSessionExpired();
        return;
      }
      toast.error(error.response?.data?.message || "Resume analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <main className="home resume-tool-page">
      <Navber />
      <section className="resume-upload-layout">
        <motion.div
          className="resume-upload-intro"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="resume-eyebrow"><Sparkles size={15} /> YOUR RESUME, WITH CLARITY</span>
          <h1>Give your resume a <span>smarter first look.</span></h1>
          <p>
            Upload a text-based PDF to get an ATS-readiness estimate, resume
            quality insights, and practical next steps.
          </p>
          <div className="resume-upload-points">
            <span><FileCheck2 size={17} /> Clear, actionable feedback</span>
            <span><LockKeyhole size={17} /> Your PDF is processed for this analysis only</span>
          </div>
          <div className={`resume-plan-status${isPremium ? " premium" : ""}`}>
            <strong>{isPremium ? "PREMIUM PLAN" : "FREE PLAN"}</strong>
            <span>{isPremium ? "Unlimited AI resume analysis" : `${usage.aiAnalysesUsed}/${plan.monthlyAiLimit} AI analyses used this month`}</span>
            {!isPremium && <Link to="/pricing">Upgrade for unlimited AI</Link>}
          </div>
        </motion.div>

        <motion.form
          className="resume-upload-card"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.12 }}
        >
          <div className="resume-upload-card-heading">
            <div className="resume-upload-heading-icon"><UploadCloud size={22} /></div>
            <div>
              <h2>Upload your resume</h2>
              <p>PDF only · Up to 10 MB</p>
            </div>
          </div>

          <button
            className={`resume-dropzone${dragging ? " is-dragging" : ""}${file ? " has-file" : ""}`}
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              className="resume-file-input"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => {
                chooseFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            {file ? (
              <>
                <span className="resume-file-icon"><FileText size={25} /></span>
                <strong>{file.name}</strong>
                <small>{(file.size / (1024 * 1024)).toFixed(2)} MB · Ready to analyze</small>
              </>
            ) : (
              <>
                <span className="resume-upload-icon"><UploadCloud size={28} /></span>
                <strong>Drop your PDF here</strong>
                <small>or browse files from your device</small>
              </>
            )}
          </button>

          {file && (
            <button
              className="resume-remove-file"
              type="button"
              onClick={() => setFile(null)}
            >
              <X size={14} /> Remove file
            </button>
          )}

          <button className="primary-btn resume-analyze-button" type="submit" disabled={analyzing || !canAnalyze}>
            {analyzing ? (
              <><span className="resume-loading-spinner" /> Reading your resume…</>
            ) : (
              <>{canAnalyze ? "Analyze my resume" : "Monthly limit reached"} <Sparkles size={17} /></>
            )}
          </button>
          <p className="resume-privacy-note">
            Resume text is sent to the app's configured AI provider to generate your report.
            Avoid uploading documents you do not want processed by that service.
          </p>
        </motion.form>
      </section>

      <footer className="home-footer">
        <Brand />
        <p>© {new Date().getFullYear()} T-ResumeIQ. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default ResumeCheck;
