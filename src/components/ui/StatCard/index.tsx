"use client";

import React from "react";
import { cn } from "@/lib/cn";
import styles from "./StatCard.module.css";
import { TrendingUp, TrendingDown } from "lucide-react";

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
  sparklineData?: number[];
}

// Helper to generate smooth SVG path for sparkline
function renderSparkline(data: number[], colorClass: string) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 36;
  const padding = 3;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `M 0,${height} L ${points.join(" L ")} L ${width},${height} Z`;

  return (
    <div className={styles.sparklineWrap}>
      <svg
        className={styles.sparklineSvg}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`grad-${colorClass}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${colorClass})`} className={styles[colorClass]} />
        <path
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles[colorClass]}
        />
      </svg>
    </div>
  );
}

function StatCard({
  title,
  value,
  delta,
  icon,
  iconColor = "primary",
  className,
  loading = false,
  sparklineData,
}: StatCardProps) {
  if (loading) {
    return (
      <div className={cn(styles.card, styles[`variant-${iconColor}`], className)}>
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
    <div className={cn(styles.card, styles[`variant-${iconColor}`], className)}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {icon && (
          <span className={cn(styles.iconWrapper, styles[`icon-${iconColor}`])}>
            {icon}
          </span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.mainInfo}>
          <span className={styles.value}>{value}</span>
          {delta !== undefined && (
            <div className={styles.deltaWrapper}>
              <span className={cn(styles.deltaBadge, isPositive ? styles.positive : styles.negative)}>
                {isPositive ? (
                  <TrendingUp size={12} strokeWidth={2.2} />
                ) : (
                  <TrendingDown size={12} strokeWidth={2.2} />
                )}
                <span>{Math.abs(delta.value)}%</span>
              </span>
              {delta.label && <span className={styles.deltaLabel}>{delta.label}</span>}
            </div>
          )}
        </div>

        {sparklineData && renderSparkline(sparklineData, `spark-${iconColor}`)}
      </div>
    </div>
  );
}

export { StatCard };
export default StatCard;
