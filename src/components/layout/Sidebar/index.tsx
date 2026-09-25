"use client";

import React from "react";
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
  X,
} from "lucide-react";

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  disabled?: boolean;
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
    disabled: true,
  },
  {
    key: "deals",
    label: "Deals",
    href: "/deals",
    icon: <Handshake size={20} strokeWidth={1.6} />,
    disabled: true,
  },
  {
    key: "calendar",
    label: "Calendar",
    href: "/calendar",
    icon: <CalendarDays size={20} strokeWidth={1.6} />,
    disabled: true,
  },
  {
    key: "reports",
    label: "Reports",
    href: "/reports",
    icon: <BarChart3 size={20} strokeWidth={1.6} />,
    disabled: true,
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: <Settings size={20} strokeWidth={1.6} />,
    disabled: true,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void;
  isMobile?: boolean;
}

function Sidebar({ collapsed = false, onToggle, onMobileClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const showText = !collapsed || isMobile;

  return (
    <aside className={cn(styles.sidebar, collapsed && !isMobile && styles.collapsed)}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoMark}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#FFFFFF"/>
            <path d="M7 16L14 8l7 8" stroke="#0A63C5" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M10 20h8" stroke="#0A63C5" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </span>
        {showText && <span className={styles.logoText}>PropFlow</span>}
        {isMobile && onMobileClose && (
          <button
            onClick={onMobileClose}
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              borderRadius: "6px",
              padding: "4px",
              display: "flex",
              cursor: "pointer",
            }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.navSection}>
          {showText && <span className={styles.navLabel}>Main Menu</span>}
          {NAV_ITEMS.map((item) => {
            const isActive = !item.disabled && (
              pathname === item.href || 
              (item.href !== "/" && pathname?.startsWith(item.href))
            );

            if (item.disabled) {
              return (
                <div
                  key={item.key}
                  className={cn(styles.navItem, styles.disabledNav)}
                  title={showText ? `${item.label} (Coming Soon)` : `${item.label} (Coming Soon)`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {showText && (
                    <>
                      <span className={styles.navItemLabel}>{item.label}</span>
                      <span className={styles.soonBadge}>Soon</span>
                    </>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onMobileClose}
                className={cn(styles.navItem, isActive && styles.active)}
                aria-current={isActive ? "page" : undefined}
                title={!showText ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {showText && (
                  <>
                    <span className={styles.navItemLabel}>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={styles.navBadge}>{item.badge}</span>
                    )}
                  </>
                )}
                {!showText && item.badge !== undefined && (
                  <span className={styles.navBadgeDot} aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </div>

        <div className={styles.navBottom}>
          {showText && <span className={styles.navLabel}>System</span>}
          {BOTTOM_ITEMS.map((item) => {
            const isActive = !item.disabled && pathname === item.href;

            if (item.disabled) {
              return (
                <div
                  key={item.key}
                  className={cn(styles.navItem, styles.disabledNav)}
                  title={`${item.label} (Coming Soon)`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {showText && (
                    <>
                      <span className={styles.navItemLabel}>{item.label}</span>
                      <span className={styles.soonBadge}>Soon</span>
                    </>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onMobileClose}
                className={cn(styles.navItem, isActive && styles.active)}
                aria-current={isActive ? "page" : undefined}
                title={!showText ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {showText && <span className={styles.navItemLabel}>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      {showText && (
        <div className={styles.user}>
          <div className={styles.userAvatar}>
            <span style={{ backgroundColor: "#2584F6" }}>MK</span>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Manju Kumar</span>
            <span className={styles.userRole}>Admin</span>
          </div>
        </div>
      )}
      {!showText && (
        <div className={styles.userCollapsed}>
          <div className={styles.userAvatar}>
            <span style={{ backgroundColor: "#2584F6" }}>MK</span>
          </div>
        </div>
      )}

      {/* Toggle Button for Desktop */}
      {!isMobile && onToggle && (
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
