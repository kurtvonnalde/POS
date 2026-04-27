import './AppLayout.scss'
// src/components/Layout.tsx
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import type { ReactNode } from "react";
import { useState } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <div className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <main className="main-content-wrapper">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
