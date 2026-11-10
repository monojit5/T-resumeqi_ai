
import './App.css'
import './index.css'
import { lazy, Suspense, useContext, useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import About from './pages/About';
import Features from './pages/Features';
import HowToWork from './pages/HowToWork';
import { UserContext } from './context/UserContext';

const ResumeCheck = lazy(() => import('./pages/ResumeCheck'));
const ResumeDashboard = lazy(() => import('./pages/ResumeDashboard'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const Pricing = lazy(() => import('./pages/Pricing'));
const DemoCheckout = lazy(() => import('./pages/DemoCheckout'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RequireAuth({ children }) {
  const { auth } = useContext(UserContext);
  const location = useLocation();

  return auth?.token
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
}

function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowToWork />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Suspense fallback={<div className="page-loading">Loading pricing…</div>}><Pricing /></Suspense>} />
        <Route
          path="/demo-checkout"
          element={
            <RequireAuth>
              <Suspense fallback={<div className="page-loading">Loading demo checkout…</div>}>
                <DemoCheckout />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/resume-check"
          element={
            <RequireAuth>
              <Suspense fallback={<div className="page-loading">Loading resume tools…</div>}>
                <ResumeCheck />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/resume-builder"
          element={
            <RequireAuth>
              <Suspense fallback={<div className="page-loading">Loading your resume workspace…</div>}>
                <ResumeBuilder />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/resume-dashboard"
          element={
            <RequireAuth>
              <Suspense fallback={<div className="page-loading">Loading your report…</div>}>
                <ResumeDashboard />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Suspense fallback={<div className="page-loading">Finding your page…</div>}><NotFound /></Suspense>} />
      </Routes>
    </>
  )
}

export default App
