import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Heart, LogOut, Menu, Moon, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import Brand from "./Brand";
import { UserContext } from "../context/UserContext";
import { SubscriptionContext } from "../context/SubscriptionContext";
import "./Navber.css";

const Navber = () => {
  const { auth, handleLogout } = useContext(UserContext);
  const { isPremium, subscription } = useContext(SubscriptionContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const navRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!navRef.current?.contains(event.target)) {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const nameParts = auth?.name?.trim().split(/\s+/).filter(Boolean) || [];
  const initials = nameParts.length
    ? `${nameParts[0][0]}${nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : ""}`.toUpperCase()
    : "U";

  const closeMenu = () => setMenuOpen(false);
  const journeyPath = auth?.token ? "/resume-builder" : "/login";
  const journeyState = auth?.token ? undefined : { from: { pathname: "/resume-builder" } };
  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      ref={navRef}
      className="navbar nav-modern"
      initial={{ opacity: 0, y: -35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Brand className="nav-brand-link" onClick={closeMenu} />

      <button
        className="nav-menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div id="primary-navigation" className={`nav-links nav-modern-links${menuOpen ? " is-open" : ""}`}>
        <Link className={isActive("/") ? "is-active" : ""} to="/" onClick={closeMenu} aria-current={isActive("/") ? "page" : undefined}>Home</Link>
        <Link className={isActive("/features") ? "is-active" : ""} to="/features" onClick={closeMenu} aria-current={isActive("/features") ? "page" : undefined}>Features</Link>
        <Link className={isActive("/about") ? "is-active" : ""} to="/about" onClick={closeMenu} aria-current={isActive("/about") ? "page" : undefined}>About</Link>
      </div>

      <div className="nav-buttons">
        <Link
          to={journeyPath}
          state={journeyState}
          className="primary-btn nav-signup nav-modern-cta"
          aria-label={auth?.token ? "Go to Resume Builder" : "Get Started"}
          onClick={closeMenu}
        >
          <span>{auth?.token ? "Go to Resume Builder" : "Get Started"}</span> <ArrowRight size={16} />
        </Link>
        {auth ? (
          <div className="user-menu">
            <button
              className="user-avatar"
              type="button"
              aria-label={`Open ${auth.name || "user"} menu`}
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {initials}
              <ChevronDown className="avatar-chevron" size={14} />
            </button>

            {dropdownOpen && (
              <div className="user-dropdown" role="menu">
                <div className="dropdown-user-name">{auth.name}</div>
                <span className={`dropdown-plan-badge${isPremium ? " premium" : ""}`}>
                  {isPremium ? "PREMIUM" : "FREE"} PLAN
                </span>
                {isPremium && subscription?.expiresAt && (
                  <div className="dropdown-plan-expiry">
                    Expires {new Date(subscription.expiresAt).toLocaleDateString()}
                  </div>
                )}
                <div className="dropdown-theme-options" aria-label="Color theme">
                  <button
                    className={theme === "light" ? "selected" : ""}
                    type="button"
                    role="menuitem"
                    aria-pressed={theme === "light"}
                    onClick={() => setTheme("light")}
                  >
                    <Heart size={16} /> Girl mode
                  </button>
                  <button
                    className={theme === "dark" ? "selected" : ""}
                    type="button"
                    role="menuitem"
                    aria-pressed={theme === "dark"}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon size={16} /> Dark mode
                  </button>
                </div>
                <button
                  className="dropdown-logout"
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </motion.nav>
  );
};

export default Navber;
