import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast';
import  axios  from 'axios';
import { UserContext } from "./UserContext";
import API_URL from "../config/api";

const Userprovider = ({children}) => {
      const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [auth, setAuth] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("auth") || "null");
      if (
        savedUser &&
        typeof savedUser.name === "string" &&
        typeof savedUser.email === "string" &&
        typeof savedUser.token === "string" &&
        savedUser.token.trim()
      ) {
        return savedUser;
      }
      localStorage.removeItem("auth");
      return null;
    } catch (error) {
      console.error("Could not restore saved login:", error);
      localStorage.removeItem("auth");
      return null;
    }
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if(!form.name || !form.email || !form.password || !form.confirmPassword){
      toast.error("Please fill all the fields");
      return;
    }
    if(form.password.length < 6 || form.password.length > 100){
      toast.error("Password must be between 6 and 100 characters");
      return;
    }
    if(!/\S+@\S+\.\S+/.test(form.email)){
      toast.error("Please enter a valid email");
      return;
    }
    
    try{
      const responce = await axios.post(`${API_URL}/user/register`, form);
      if(responce.status !== 201){
        toast.error("Something went wrong");
      } else {
        toast.success("otp sent successfully");
        navigate("/verify-otp", {
          state: { email: form.email, from: location.state?.from }
        });
      }
    }catch(error){
      toast.error(error.response?.data?.message || "Unable to register");
    }
  
  };

  const [otp, setOtp] = useState(["","","","","",""]);
  const [resendingOtp, setResendingOtp] = useState(false);
  const refs = useRef([]);
  const location = useLocation();
  

  const verificationEmail = location.state?.email || "";

  const handleChanges = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      refs.current[index + 1].focus();
    }
  };

  const handleResendOtp = async () => {
    if (!verificationEmail) {
      toast.error("Please register before requesting a new verification code");
      navigate("/register");
      return;
    }
    if (resendingOtp) return;

    setResendingOtp(true);
    try {
      await axios.post(`${API_URL}/user/resend-otp`, { email: verificationEmail });
      setOtp(["", "", "", "", "", ""]);
      toast.success("A new verification code has been sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend verification code");
    } finally {
      setResendingOtp(false);
    }
  };

  const handleSubmits = async (e) => {
    e.preventDefault();

    if (otp.join("").length !== 6) {
      toast.error("Enter all six digits");
      return;
    }
    if (!verificationEmail) {
      toast.error("Please register before verifying your email");
      navigate("/register");
      return;
    }
    try{
      await axios.post(`${API_URL}/user/verify-otp`, {
        email: verificationEmail,
        otp: otp.join("")
      });
      toast.success("OTP verified successfully");
      navigate("/login", { state: { from: location.state?.from } });
    }catch(error){
      toast.error(error.response?.data?.message || "Unable to verify OTP");
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitsi = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (password.length < 6 || password.length > 100) {
      toast.error("Password must be between 6 and 100 characters");
      return;
    }
    
    try{
      const response = await axios.post(`${API_URL}/user/login`, { email, password });
      const { user, token } = response.data.data;
      const authData = {
        name: user.name,
        email: user.email,
        token
      };
      setAuth(authData);
      localStorage.setItem("auth", JSON.stringify(authData));
      toast.success("Login successful");
      const returnTo = location.state?.from;
      const returnPath = returnTo?.pathname?.startsWith("/")
        && !returnTo.pathname.startsWith("//")
        ? `${returnTo.pathname}${returnTo.search || ""}${returnTo.hash || ""}`
        : "/";
      navigate(
        returnPath
      );
    }catch(error){
      toast.error(error.response?.data?.message || "Unable to log in");
    }
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    sessionStorage.removeItem("resumeAnalysis");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSessionExpired = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    sessionStorage.removeItem("resumeAnalysis");
    toast.error("Your login expired. Please log in again.");
    navigate("/login", { state: { from: location } });
  };


  return (
    <UserContext.Provider value={{
        handleChange,
        handleSubmit,
        form,
        show,
        setShow,
        handleChanges,
        handleSubmits,
        handleResendOtp,
        resendingOtp,
        otp,
        refs,
        email,
        setEmail,
        password,
        setPassword,
        handleSubmitsi,
        auth,
        handleLogout,
        handleSessionExpired
    }}>
        {children}
    </UserContext.Provider>
    
  )
}

export default Userprovider;