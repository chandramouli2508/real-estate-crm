"use client";

import React from "react";
import { cn } from "@/lib/cn";
import styles from "./Header.module.css";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { SearchInput } from "@/components/ui/SearchInput";

interface HeaderProps {
  onMenuToggle?: () => void;
  title?: string;
}

function Header({ onMenuToggle, title }: HeaderProps) {
  const [search, setSearch] = React.useState("");

  const userMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.25"/>
          <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
        </svg>
      ),
      onClick: () => {},
    },
    {
      key: "account",
      label: "Account Settings",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25"/>
          <path d="M8 2v1M8 13v1M2 8h1M13 8h1M3.8 3.8l.7.7M11.5 11.5l.7.7M3.8 12.2l.7-.7M11.5 4.5l.7-.7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
        </svg>
      ),
      onClick: () => {},
    },
    { key: "div1", label: "", divider: true },
    {
      key: "logout",
      label: "Sign Out",
      danger: true,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 11l3-3-3-3M13 8H6M7 3H3a1 1 0 00-1 1v8a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      onClick: () => {},
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {onMenuToggle && (
          <button
            className={styles.menuBtn}
            onClick={onMenuToggle}
            aria-label="Toggle navigation"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        {title && <span className={styles.pageTitle}>{title}</span>}
      </div>

      <div className={styles.center}>
        <SearchInput
          placeholder="Search leads, properties, clients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          className={styles.searchInput}
          aria-label="Global search"
        />
      </div>

      <div className={styles.right}>
        {/* Notifications */}
        <button className={styles.iconBtn} aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a6 6 0 016 6c0 4 1.5 5.5 1.5 5.5H2.5S4 12 4 8a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M8.3 16a1.8 1.8 0 003.4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className={styles.notifBadge} aria-label="3 unread notifications">3</span>
        </button>

        {/* Help */}
        <button className={styles.iconBtn} aria-label="Help and support">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 7.5C8 6.7 8.9 6 10 6s2 .7 2 1.5c0 1.5-2 1.5-2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="10" cy="14" r=".75" fill="currentColor"/>
          </svg>
        </button>

        {/* Divider */}
        <span className={styles.divider} />

        {/* User avatar + dropdown */}
        <Dropdown
          trigger={
            <div className={styles.userTrigger}>
              <Avatar name="Manju Kumar" size="sm" status="online" />
              <span className={styles.userName}>Manju Kumar</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.chevron}>
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          }
          items={userMenuItems}
          align="right"
          className={styles.userDropdown}
        />
      </div>
    </header>
  );
}

export { Header };
export default Header;
