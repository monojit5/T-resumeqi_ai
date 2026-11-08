
import { MailCheck } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function VerifyOtp() {
  const location = useLocation();
  const email = location.state?.email || "your email";
  const { handleChanges, handleSubmits, otp, refs } = useContext(UserContext);
  return (
    <AuthShell>

      <div className="otp-icon">
        <MailCheck size={30}/>
      </div>

      <span className="tag">EMAIL VERIFICATION</span>

      <h2>Verify Your Email</h2>

      <p className="auth-subtitle">
        Enter the verification code sent to
        <b> {email}</b>
      </p>

      <form onSubmit={handleSubmits}>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => refs.current[index] = el}
              value={digit}
              maxLength={1}
              inputMode="numeric"
              onChange={e => handleChanges(e.target.value, index)}
              onKeyDown={e => {
                if (e.key === "Backspace" && !digit && index > 0) {
                  refs.current[index - 1].focus();
                }
              }}
            />
          ))}
        </div>

        <button className="primary-btn submit-btn">
          Verify OTP
        </button>

      </form>

      <p className="resend">
        Didn't receive the code?
        <button type="button" onClick={() => alert("Connect resend OTP API")}>
          Resend OTP
        </button>
      </p>

      <p className="auth-bottom">
        <Link to="/register">Back to Register</Link>
      </p>

    </AuthShell>
  );
}

export default VerifyOtp;