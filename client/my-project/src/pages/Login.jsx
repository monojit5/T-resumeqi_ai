import { useContext, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { UserContext } from "../context/UserContext";

function Login() {
    const [show, setShow] = useState(false);
 const location = useLocation();
 const {handleSubmitsi, email, setEmail, password, setPassword} = useContext(UserContext);
  return (
    <AuthShell>

      <span className="tag">WELCOME BACK</span>

      <h2>Login to Your Account</h2>

      <p className="auth-subtitle">
        Continue your journey with ResumeIQ.
      </p>

      <form className="auth-form" onSubmit={handleSubmitsi}>

        <label>Email Address</label>

        <div className="input-box">
          <Mail/>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
          />
        </div>

        <div className="password-label">
          <label>Password</label>
      
        </div>

        <div className="input-box">
          <Lock/>
          <input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />

          <button type="button" onClick={() => setShow(!show)}>
            {show ? <EyeOff/> : <Eye/>}
          </button>
        </div>

        <button className="primary-btn submit-btn">
          Login
        </button>

      </form>
      <p className="auth-bottom">
        Don't have an account?
        <Link to="/register" state={{ from: location.state?.from }}> Register</Link>
      </p>

    </AuthShell>
  );
}

export default Login;