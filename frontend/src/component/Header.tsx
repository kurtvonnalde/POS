import React, { useState } from "react";
import "./Header.scss";
import { FaCartPlus, FaMoon, FaArrowCircleLeft, FaSun, FaClipboardList } from "react-icons/fa";
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
      <div className="sidebar-wrapper">
        <div className="sidebar-logo">KrawlPOS</div>
        {/* theme toggle */}
        <div className="sidebar-themeContainer">
          <label
            htmlFor="theme-toggle"
            className={`sidebar-themeLabel${isDarkMode ? " switched" : ""}`}
          >
            <input
              className="sidebar-themeInput"
              type="checkbox"
              id="theme-toggle"
              onChange={handleThemeChange}
            />
            <div className="sidebar-themeType light">
              <FaSun style={{ marginRight: "10px" }} />
              <span className="sidebar-themeInputText">Light</span>
            </div>
            <div className="sidebar-themeType dark">
              <FaMoon style={{ marginRight: "10px" }} />
              <span className="sidebar-themeInputText">Dark</span>
            </div>
          </label>
        </div>
        {/* nav links */}
        <ul className="sidebar-list">
          <li className={`sidebar-listItem ${isActive("/products") ? "active" : ""}`}>
            <Link to="/products" className="nav-link">
              <FaCartPlus style={{ marginRight: "10px" }} className="sidebar-listIcon" />
              <span className="sidebar-listItemText">Products</span>
            </Link>
          </li>
          <li className={`sidebar-listItem ${isActive("/sales") ? "active" : ""}`}>
            <Link to="/sales" className="nav-link">
              <FaChartSimple style={{ marginRight: "10px" }} className="sidebar-listIcon" />
              <span className="sidebar-listItemText">Sales</span>
            </Link>
          </li>
          <li className={`sidebar-listItem ${isActive("/reports") ? "active" : ""}`}>
            <Link to="/reports" className="nav-link">
              <FaChartLine style={{ marginRight: "10px" }} className="sidebar-listIcon" />
              <span className="sidebar-listItemText">Reports</span>
            </Link>
          </li>
          <li className={`sidebar-listItem ${isActive("/inventory") ? "active" : ""}`}>
            <Link to="/inventory" className="nav-link">
              <FaClipboardList style={{ marginRight: "10px" }} className="sidebar-listIcon" />
              <span className="sidebar-listItemText">Inventory</span>
            </Link>
          </li>
          <li className={`sidebar-listItem ${isActive("/settings") ? "active" : ""}`}>
            <Link to="/settings" className="nav-link">
              <FaGear style={{ marginRight: "10px" }} className="sidebar-listIcon" />
              <span className="sidebar-listItemText">Settings</span>
            </Link>
          </li>
        </ul>
        <div className="sidebar-profileSection">
          <img
            src="https://assets.codepen.io/3306515/i-know.jpg"
            width="40"
            height="40"
            alt="Monica Geller"
          />
          <span>Monica Geller</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
