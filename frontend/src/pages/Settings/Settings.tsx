import React, { useState } from "react";
import "./Settings.scss";
import { ManageUsers, ManageSupplier, ManageInventory, ManageCategories } from "./components";

export default function Settings() {
  const tabs = [
    { id: "tab1", label: "Manage Users" },
    { id: "tab2", label: "Manage Supplier" },
    { id: "tab3", label: "Manage Inventory" },
    { id: "tab4", label: "Manage Categories" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab1":
        return <ManageUsers />;
      case "tab2":
        return <ManageSupplier />;
      case "tab3":
        return <ManageInventory />;
      case "tab4":
        return <ManageCategories />;
      default:
        return <ManageUsers />;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings Page</h1>
        <p>This is where you can manage your settings.</p>
      </div>
      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="settings-content-wrapper">
        <div className="settings-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
