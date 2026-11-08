import Brand from "./Brand";
import { } from "react-router-dom";
import { Sparkles, ShieldCheck } from "lucide-react";

function AuthShell({ children }) {
  return (
    <div className="auth-layout">

      <div className="auth-left">
        <Brand/>

        <div className="auth-message">
          <span className="tag">
            <Sparkles size={14}/> AI CAREER ASSISTANT
          </span>

          <h1>
            Build Your Future
            <span> With Confidence.</span>
          </h1>

          <p>
            Make smarter career decisions with
            AI-powered resume analysis.
          </p>

          <div className="auth-score">
            <h2>92<span>/100</span></h2>
            <div>
              <b>Resume Score</b>
              <p>Excellent Profile</p>
            </div>
          </div>
        </div>

        <p className="secure-text">
          <ShieldCheck size={16}/>
          Your information is secure.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="mobile-brand">
            <Brand/>
          </div>

          {children}

        </div>
      </div>

    </div>
  );
}

export default AuthShell;