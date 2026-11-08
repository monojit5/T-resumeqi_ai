import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Clipboard,
  FileText,
  LoaderCircle,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const SCAN_DURATION = 3200;

function ResumeRewriteReveal({ analysis, fileName, onClose }) {
  const [progress, setProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  const improvedResume = typeof analysis.improvedResume === "string"
    ? analysis.improvedResume.trim()
    : "";

  useEffect(() => {
    if (!improvedResume) return undefined;

    const startedAt = Date.now();
    let revealTimeout;
    const intervalId = window.setInterval(() => {
      const nextProgress = Math.min(100, Math.round(((Date.now() - startedAt) / SCAN_DURATION) * 100));
      setProgress(nextProgress);
      if (nextProgress === 100) {
        window.clearInterval(intervalId);
        revealTimeout = window.setTimeout(() => setIsRevealed(true), 260);
      }
    }, 60);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(revealTimeout);
    };
  }, [improvedResume]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(improvedResume);
      setCopyState("copied");
    } catch (error) {
      console.error("Could not copy the improved resume:", error);
      setCopyState("error");
    }
  };

  const downloadDraft = () => {
    const escapedResume = improvedResume.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);
    const documentContent = `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#222;line-height:1.55}pre{font:inherit;white-space:pre-wrap;overflow-wrap:break-word}</style></head><body><pre>${escapedResume}</pre></body></html>`;
    const blob = new Blob([documentContent], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const baseName = (fileName || "resume").replace(/\.pdf$/i, "").replace(/[<>:"/\\|?*]/g, "-").replace(/[. ]+$/g, "") || "resume";
    link.href = url;
    link.download = `${baseName}-enhanced.doc`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <motion.div
      className="resume-reveal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-reveal-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        className="resume-reveal"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <header className="resume-reveal-header">
          <div>
            <span className="resume-eyebrow"><Sparkles size={14} /> TANUJA&apos;S RESUME STUDIO</span>
            <h2 id="resume-reveal-title">A stronger story, <span>still yours.</span></h2>
            <p>Compare your resume insights with an AI draft grounded in the details from your upload.</p>
          </div>
          <button className="resume-reveal-close" type="button" onClick={onClose} aria-label="Close resume studio">
            <X size={20} />
          </button>
        </header>

        <div className={`resume-reveal-status${isRevealed ? " is-ready" : ""}`}>
          {isRevealed ? <Check size={16} /> : <LoaderCircle size={16} />}
          <span>
            {improvedResume
              ? (isRevealed ? "Your enhanced draft is ready to review" : `Scanning your resume insights · ${progress}%`)
              : "This report does not include an enhanced draft"}
          </span>
          {improvedResume && <span className="resume-reveal-status-file">{fileName || "Your resume"}</span>}
        </div>

        {improvedResume ? (
          <div className={`resume-reveal-panels${isRevealed ? " is-revealed" : ""}`}>
            <article className="resume-reveal-panel resume-source-panel">
              <div className="resume-reveal-panel-heading">
                <span className="resume-reveal-step">01</span>
                <div><small>YOUR ORIGINAL</small><h3>What you bring</h3></div>
                <FileText size={19} />
              </div>
              <div className="resume-source-document">
                <span className="resume-source-file"><FileText size={14} /> {fileName || "Resume.pdf"}</span>
                <strong>Resume snapshot</strong>
                <p>{analysis.summary}</p>
                <div className="resume-source-score">
                  <span>Current overall score</span>
                  <strong>{analysis.overallScore}<small>/100</small></strong>
                </div>
                <span className="resume-source-divider" />
                <small className="resume-source-label">WHAT&apos;S ALREADY WORKING</small>
                <ul>
                  {(analysis.strengths || []).slice(0, 3).map((strength, index) => (
                    <li key={`${strength}-${index}`}><Check size={14} />{strength}</li>
                  ))}
                </ul>
                <small className="resume-source-label">FOCUSED IMPROVEMENTS</small>
                <div className="resume-source-tags">
                  {(analysis.improvements || []).slice(0, 3).map((item) => (
                    <span key={item.title}>{item.title}</span>
                  ))}
                </div>
              </div>
              {!isRevealed && <span className="resume-scan-beam" aria-hidden="true" />}
            </article>

            <article className="resume-reveal-panel resume-enhanced-panel">
              <div className="resume-reveal-panel-heading">
                <span className="resume-reveal-step"><Sparkles size={15} /></span>
                <div><small>AI-ENHANCED DRAFT</small><h3>Your next version</h3></div>
                {isRevealed && <span className="resume-draft-ready">READY</span>}
              </div>
              <AnimatePresence mode="wait">
                {isRevealed ? (
                  <motion.div
                    className="resume-enhanced-document"
                    key="draft"
                    initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                  >
                    <pre>{improvedResume}</pre>
                  </motion.div>
                ) : (
                  <motion.div
                    className="resume-draft-placeholder"
                    key="scanning"
                    exit={{ opacity: 0, scale: 0.98 }}
                  >
                    <span className="resume-draft-sparkle"><Sparkles size={24} /></span>
                    <strong>Shaping your strongest story</strong>
                    <span>Keeping your facts. Improving the flow.</span>
                    <div className="resume-draft-progress"><i style={{ width: `${progress}%` }} /></div>
                    <small>{progress < 35 ? "Reading your resume insights" : progress < 72 ? "Matching focused improvements" : "Revealing your new draft"}</small>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          </div>
        ) : (
          <div className="resume-reveal-missing">
            <p>This older report was created before resume drafting was available. Analyze your PDF again to create a grounded, AI-enhanced draft.</p>
            <Link to="/resume-check" className="primary-btn" onClick={onClose}>
              Analyze again <ArrowUpRight size={16} />
            </Link>
          </div>
        )}

        {improvedResume && (
          <footer className="resume-reveal-footer">
            <p>Review every detail before using this draft. AI can make mistakes.</p>
            <div>
              {copyState === "error" && <span className="resume-copy-error">Copy failed. Select the draft text to copy it.</span>}
              <button
                className="resume-copy-button"
                type="button"
                onClick={downloadDraft}
                disabled={!isRevealed}
              >
                <ArrowDownToLine size={15} />
                Download
              </button>
              <button
                className="resume-copy-button"
                type="button"
                onClick={copyDraft}
                disabled={!isRevealed}
              >
                {copyState === "copied" ? <Check size={15} /> : <Clipboard size={15} />}
                {copyState === "copied" ? "Copied" : "Copy draft"}
              </button>
            </div>
          </footer>
        )}
      </motion.section>
    </motion.div>
  );
}

export default ResumeRewriteReveal;
