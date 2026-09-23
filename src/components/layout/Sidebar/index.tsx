"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import styles from "./Sidebar.module.css";

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    key: "leads",
    label: "Leads",
    href: "/leads",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 18c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    badge: 12,
  },
  {
    key: "properties",
    label: "Properties",
    href: "/properties",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M7 18v-7h6v7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: "clients",
    label: "Clients",
    href: "/clients",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="8" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M1 17c0-3.5 3-6 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="15" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 17c0-2.5 1.5-4.5 3-4.5s3 2 3 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "deals",
    label: "Deals",
    href: "/deals",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10h14M3 6h14M3 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="16" cy="14" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M15 14l.8.8L17.5 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: "calendar",
    label: "Calendar",
    href: "/calendar",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2.5" y="3.5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 2v3M13 2v3M2.5 8h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "reports",
    label: "Reports",
    href: "/reports",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 14l4-4 3 3 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.1 4.1l1.06 1.06M14.84 14.84l1.06 1.06M4.1 15.9l1.06-1.06M14.84 5.16l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(styles.sidebar, collapsed && styles.collapsed)}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoMark}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#2563EB"/>
            <path d="M7 16L14 8l7 8" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M10 20h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
        {!collapsed && <span className={styles.logoText}>PropFlow</span>}
      </div>

      {/* Navigation */}
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.navSection}>
          {!collapsed && <span className={styles.navLabel}>Main Menu</span>}
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(styles.navItem, isActive && styles.active)}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className={styles.navItemLabel}>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={styles.navBadge}>{item.badge}</span>
                    )}
                  </>
                )}
                {collapsed && item.badge !== undefined && (
                  <span className={styles.navBadgeDot} aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </div>

        <div className={styles.navBottom}>
          {!collapsed && <span className={styles.navLabel}>System</span>}
          {BOTTOM_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(styles.navItem, isActive && styles.active)}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!collapsed && <span className={styles.navItemLabel}>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      {!collapsed && (
        <div className={styles.user}>
          <div className={styles.userAvatar}>
            <span style={{ backgroundColor: "#2563EB" }}>MK</span>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Manju Kumar</span>
            <span className={styles.userRole}>Admin</span>
          </div>
        </div>
      )}
      {collapsed && (
        <div className={styles.userCollapsed}>
          <div className={styles.userAvatar}>
            <span style={{ backgroundColor: "#2563EB" }}>MK</span>
          </div>
        </div>
      )}

      {/* Toggle */}
      {onToggle && (
        <button
          className={styles.toggleBtn}
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
          >
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </aside>
  );
}

export { Sidebar };
export default Sidebar;
