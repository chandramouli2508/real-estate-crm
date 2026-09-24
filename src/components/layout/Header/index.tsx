"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import styles from "./Header.module.css";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { SearchInput } from "@/components/ui/SearchInput";
import { User, Settings, LogOut, Bell, HelpCircle, ChevronDown, Menu } from "lucide-react";

interface HeaderProps {
  onMenuToggle?: () => void;
  title?: string;
}

function Header({ onMenuToggle, title }: HeaderProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("Rajesh Sharma");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setUserName(parsed.name);
        } catch (_) {}
      }
    }
  }, []);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    router.push("/login");
  }

  const userMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <User size={15} strokeWidth={1.6} />,
      onClick: () => {},
    },
    {
      key: "account",
      label: "Account Settings",
      icon: <Settings size={15} strokeWidth={1.6} />,
      onClick: () => {},
    },
    { key: "div1", label: "", divider: true },
    {
      key: "logout",
      label: "Sign Out",
      danger: true,
      icon: <LogOut size={15} strokeWidth={1.6} />,
      onClick: handleLogout,
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
            <Menu size={20} strokeWidth={1.6} />
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
          <Bell size={20} strokeWidth={1.6} />
          <span className={styles.notifBadge} aria-label="3 unread notifications">3</span>
        </button>

        {/* Help */}
        <button className={styles.iconBtn} aria-label="Help and support">
          <HelpCircle size={20} strokeWidth={1.6} />
        </button>

        {/* Divider */}
        <span className={styles.divider} />

        {/* User avatar + dropdown */}
        <Dropdown
          trigger={
            <div className={styles.userTrigger}>
              <Avatar name={userName} size="sm" status="online" />
              <span className={styles.userName}>{userName}</span>
              <ChevronDown size={14} strokeWidth={1.8} className={styles.chevron} />
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
