"use client";

import React from "react";
import { cn } from "@/lib/cn";
import styles from "./Avatar.module.css";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    "#2563EB", "#7C3AED", "#0891B2", "#059669",
    "#D97706", "#DC2626", "#7C3AED", "#0284C7",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({
  src,
  alt,
  name = "",
  size = "md",
  status,
  className,
}: AvatarProps) {
  const initials = name ? getInitials(name) : "?";
  const bgColor = name ? getColorFromName(name) : "#6B7280";

  return (
    <span className={cn(styles.wrapper, styles[size], className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? name} className={styles.img} />
      ) : (
        <span
          className={styles.initials}
          style={{ backgroundColor: bgColor }}
          aria-label={name || "Avatar"}
        >
          {initials}
        </span>
      )}
      {status && (
        <span
          className={cn(styles.status, styles[`status-${status}`])}
          aria-label={`Status: ${status}`}
        />
      )}
    </span>
  );
}

export { Avatar };
export default Avatar;
