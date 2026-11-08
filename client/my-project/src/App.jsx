
import './App.css'
import './index.css'
import { lazy, Suspense, useContext } from "react";
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

function RequireAuth({ children }) {
  const { auth } = useContext(UserContext);
  const location = useLocation();

  return auth?.token
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
}

function App() {
  

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
          path="/resume-dashboard"
          element={
            <RequireAuth>
              <Suspense fallback={<div className="page-loading">Loading your report…</div>}>
                <ResumeDashboard />
              </Suspense>
            </RequireAuth>
          }
        />
      </Routes>
    </>
  )
}

export default App
