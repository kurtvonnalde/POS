import React from "react";
import "./Settings.scss";

export default function Settings({ isSidebarCollapsed }: { isSidebarCollapsed: boolean }) {
  return (
    <div className={`settings-container ${isSidebarCollapsed ? "shrink" : ""}`}>
      <h1>Settings Page</h1>
    </div>
  );
}
