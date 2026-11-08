import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Heart, LogOut, Menu, Moon, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import Brand from "./Brand";
import { UserContext } from "../context/UserContext";

const Navber = () => {
  const { auth, handleLogout } = useContext(UserContext);
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

  return (
    <motion.nav
      ref={navRef}
      className="navbar"
      initial={{ opacity: 0, y: -35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Brand />

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

      <div id="primary-navigation" className={`nav-links${menuOpen ? " is-open" : ""}`}>
        <Link to="/features" onClick={closeMenu}>Features</Link>
        <Link to="/resume-check" onClick={closeMenu}>Resume ATS</Link>
        <Link to="/how-it-works" onClick={closeMenu}>How it works</Link>
        <Link to="/about" onClick={closeMenu}>About</Link>
      </div>

      <div className="nav-buttons">
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
        ) : (
          <>
            <Link to="/login" className="login-btn" onClick={closeMenu}>
              Login
            </Link>
            <Link to="/register" className="primary-btn nav-signup" onClick={closeMenu}>
              Sign Up <ArrowRight size={16} />
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navber;
