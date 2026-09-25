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
  
  // Default false on initial render to ensure Server (SSR) and Client (CSR) HTML match 100% during hydration
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Sync client-only values (localStorage & window dimensions) after hydration completes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCollapsed = localStorage.getItem("propflow_sidebar_collapsed");
      if (savedCollapsed === "true") {
        setSidebarCollapsed(true);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        router.replace("/login");
      } else {
        setIsAuthenticated(true);
      }

      const checkMobile = () => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        if (!mobile) {
          setMobileSidebarOpen(false);
        }
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, [router]);

  function toggleSidebar() {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setMobileSidebarOpen((v) => !v);
    } else {
      setSidebarCollapsed((prev) => {
        const nextState = !prev;
        if (typeof window !== "undefined") {
          localStorage.setItem("propflow_sidebar_collapsed", String(nextState));
        }
        return nextState;
      });
    }
  }

  if (isAuthenticated === false) {
    return (
      <div style={{ minHeight: "100vh", width: "100vw", backgroundColor: "var(--color-bg, #F4F7FB)" }} />
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
            onMobileClose={() => setMobileSidebarOpen(false)}
            isMobile={isMobile}
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
