
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
function Register() {
  const { handleChange, handleSubmit, form, show, setShow } = useContext(UserContext);

  return (
    <AuthShell>

      <span className="tag">CREATE ACCOUNT</span>

      <h2>Create Your Account</h2>
      <p className="auth-subtitle">
        Start your AI-powered career journey.
      </p>

      <form onSubmit={handleSubmit} className="auth-form">

        <label>Full Name</label>
        <div className="input-box">
          <User/>
          <input
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            
          />
        </div>

        <label>Email Address</label>
        <div className="input-box">
          <Mail/>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
           
          />
        </div>

        <label>Password</label>
        <div className="input-box">
          <Lock/>
          <input
            type={show ? "text" : "password"}
            name="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
          />
          <button type="button" onClick={() => setShow(!show)}>
            {show ? <EyeOff/> : <Eye/>}
          </button>
        </div>

        <label>Confirm Password</label>
        <div className="input-box">
          <Lock/>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            
          />
        </div>

        <label className="terms">
          <input type="checkbox" required/>
          I agree to the Terms & Conditions
        </label>

        <button className="primary-btn submit-btn">
          Create Account
        </button>

      </form>

      <p className="auth-bottom">
        Already have an account?
        <Link to="/login"> Login</Link>
      </p>

    </AuthShell>
  );
}

export default Register;