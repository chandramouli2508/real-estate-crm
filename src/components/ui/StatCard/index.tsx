"use client";

import React from "react";
import { cn } from "@/lib/cn";
import styles from "./StatCard.module.css";

export type StatDelta = {
  value: number;
  label?: string;
  positive?: boolean;
};

export interface StatCardProps {
  title: string;
  value: string | number;
  delta?: StatDelta;
  icon?: React.ReactNode;
  iconColor?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  className?: string;
  loading?: boolean;
}

function StatCard({
  title,
  value,
  delta,
  icon,
  iconColor = "primary",
  className,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className={cn(styles.card, className)}>
        <div className={styles.header}>
          <span className={`skeleton ${styles.skTitle}`} />
          <span className={`skeleton ${styles.skIcon}`} />
        </div>
        <span className={`skeleton ${styles.skValue}`} />
        <span className={`skeleton ${styles.skDelta}`} />
      </div>
    );
  }

  const isPositive = delta?.positive !== false && (delta?.value ?? 0) >= 0;

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.header}>
        <p className={styles.title}>{title}</p>
        {icon && (
          <span className={cn(styles.iconWrapper, styles[`icon-${iconColor}`])}>
            {icon}
          </span>
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.value}>{value}</span>
        {delta !== undefined && (
          <div className={styles.deltaWrapper}>
            <span className={cn(styles.deltaBadge, isPositive ? styles.positive : styles.negative)}>
              <span className={styles.deltaArrow} aria-hidden="true">
                {isPositive ? "↑" : "↓"}
              </span>
              {Math.abs(delta.value)}%
            </span>
            {delta.label && <span className={styles.deltaLabel}>{delta.label}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export { StatCard };
export default StatCard;
