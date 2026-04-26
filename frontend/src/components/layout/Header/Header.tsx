import React, { useEffect, useState } from "react";
import "./Header.scss";
import {
  FaCartPlus,
  FaMoon,
  FaArrowCircleLeft,
  FaSun,
  FaClipboardList,
  FaUserCog,
} from "react-icons/fa";
import { FaChartLine, FaChartSimple, FaGear } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

export default function Header({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}) {
  // Initialize from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme on mount
  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleSidebarView = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className={`sidebar-container${isSidebarCollapsed ? " shrink" : ""}`}>
      <button
        className="sidebar-viewButton"
        type="button"
        aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Shrink Sidebar"}
        title={isSidebarCollapsed ? "Expand" : "Shrink"}
        onClick={handleSidebarView}
      >
        <FaArrowCircleLeft />
      </button>
      <div className="sidebar-logo">KrawlPOS</div>
      <ul className="sidebar-list">
        <li className={`sidebar-listItem ${isActive("/products") ? "active" : ""}`}>
          <Link to="/products">
            <FaCartPlus className="sidebar-listIcon" />
            <span>Products</span>
          </Link>
          <span className="sidebar-listItemText">Products</span>
        </li>
        <li className={`sidebar-listItem ${isActive("/sales") ? "active" : ""}`}>
          <Link to="/sales">
            <FaChartSimple className="sidebar-listIcon" />
            <span>Sales</span>
          </Link>
          <span className="sidebar-listItemText">Sales</span>
        </li>
        <li className={`sidebar-listItem ${isActive("/inventory") ? "active" : ""}`}>
          <Link to="/inventory">
            <FaClipboardList className="sidebar-listIcon" />
            <span>Inventory</span>
          </Link>
          <span className="sidebar-listItemText">Inventory</span>
        </li>
        <li className={`sidebar-listItem ${isActive("/reports") ? "active" : ""}`}>
          <Link to="/reports">
            <FaChartLine className="sidebar-listIcon" />
            <span>Reports</span>
          </Link>
          <span className="sidebar-listItemText">Reports</span>
        </li>
        <li className={`sidebar-listItem ${isActive("/settings") ? "active" : ""}`}>
          <Link to="/settings">
            <FaGear className="sidebar-listIcon" />
            <span>Settings</span>
          </Link>
          <span className="sidebar-listItemText">Settings</span>
        </li>
      </ul>

      <div className="sidebar-themeContainer">
        <label className="sidebar-themeLabel">
          <input
            type="checkbox"
            className="sidebar-themeInput"
            checked={isDarkMode}
            onChange={handleThemeChange}
          />
          <span className="sidebar-themeType light">
            <FaSun />
            <span className="sidebar-themeInputText">Light</span>
          </span>
          <span className="sidebar-themeType dark">
            <FaMoon />
            <span className="sidebar-themeInputText">Dark</span>
          </span>
        </label>
      </div>

      <div className="sidebar-userProfile">
        <div ref={userMenuRef} className="sidebar-userMenu">
          <button
            className="sidebar-userButton"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <FaUserCog />
            <span className="sidebar-userInfo">
              <span className="sidebar-userName">{username}</span>
              <span className="sidebar-userRole">{role}</span>
            </span>
          </button>

          {userMenuOpen && (
            <div className="sidebar-userDropdown">
              <button className="sidebar-dropdownItem" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
