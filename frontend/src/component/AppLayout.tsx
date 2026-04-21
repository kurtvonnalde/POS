import './AppLayout.scss'
// src/components/Layout.tsx
import Header from "./Header";
import Footer from "./Footer";
import type { ReactNode } from "react";
import { useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <div className={`content-area ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <main className="settings-container">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
