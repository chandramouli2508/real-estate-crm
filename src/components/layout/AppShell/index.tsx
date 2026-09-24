"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import styles from "./AppShell.module.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui/Toast";

interface AppShellProps {
  children: React.ReactNode;
}

function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        router.replace("/login");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  function toggleSidebar() {
    // On tablet+, collapse/expand; on mobile open/close
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen((v) => !v);
    } else {
      setSidebarCollapsed((v) => !v);
    }
  }

  // Prevent flash of protected content while checking auth
  if (isAuthenticated !== true) {
    return (
      <div style={{ minHeight: "100vh", width: "100vw", backgroundColor: "var(--color-bg, #0F172A)" }} />
    );
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
