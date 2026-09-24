"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import styles from "./Sidebar.module.css";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  Handshake,
  CalendarDays,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
    icon: <LayoutDashboard size={20} strokeWidth={1.6} />,
  },
  {
    key: "leads",
    label: "Leads",
    href: "/leads",
    icon: <Users size={20} strokeWidth={1.6} />,
    badge: 12,
  },
  {
    key: "properties",
    label: "Properties",
    href: "/properties",
    icon: <Building2 size={20} strokeWidth={1.6} />,
  },
  {
    key: "clients",
    label: "Clients",
    href: "/clients",
    icon: <UserCheck size={20} strokeWidth={1.6} />,
  },
  {
    key: "deals",
    label: "Deals",
    href: "/deals",
    icon: <Handshake size={20} strokeWidth={1.6} />,
  },
  {
    key: "calendar",
    label: "Calendar",
    href: "/calendar",
    icon: <CalendarDays size={20} strokeWidth={1.6} />,
  },
  {
    key: "reports",
    label: "Reports",
    href: "/reports",
    icon: <BarChart3 size={20} strokeWidth={1.6} />,
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: <Settings size={20} strokeWidth={1.6} />,
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
            <rect width="28" height="28" rx="8" fill="#4F46E5"/>
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
            <span style={{ backgroundColor: "#4F46E5" }}>MK</span>
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
            <span style={{ backgroundColor: "#4F46E5" }}>MK</span>
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
          {collapsed
            ? <ChevronRight size={16} strokeWidth={1.8} />
            : <ChevronLeft size={16} strokeWidth={1.8} />
          }
        </button>
      )}
    </aside>
  );
}

export { Sidebar };
export default Sidebar;
