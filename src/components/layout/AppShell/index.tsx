"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";
import styles from "./AppShell.module.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui/Toast";

interface AppShellProps {
  children: React.ReactNode;
}

function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function toggleSidebar() {
    // On tablet+, collapse/expand; on mobile open/close
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen((v) => !v);
    } else {
      setSidebarCollapsed((v) => !v);
    }
  }

  return (
    <ToastProvider>
      <div className={cn(styles.shell, sidebarCollapsed && styles.sidebarCollapsed)}>
        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div
            className={styles.mobileOverlay}
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <div className={cn(styles.sidebarWrapper, mobileSidebarOpen && styles.mobileOpen)}>
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
          />
        </div>

        {/* Header */}
        <Header onMenuToggle={toggleSidebar} />

        {/* Main content */}
        <main
          className={styles.main}
          id="main-content"
          tabIndex={-1}
        >
          <div className={styles.mainInner}>
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}

export { AppShell };
export default AppShell;
