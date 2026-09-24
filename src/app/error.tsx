"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import styles from "./not-found.module.css";
import { AlertTriangle, RefreshCw, LayoutGrid, ArrowLeft } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("System Runtime Error:", error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.gridPattern} aria-hidden="true" />

      <div className={styles.contentWrapper}>
        <div className={styles.ghostText} style={{ fontSize: "clamp(5rem, 14vw, 9rem)" }} aria-hidden="true">
          500
        </div>

        <div className={styles.card}>
          <div className={styles.badge} style={{ background: "rgba(239, 68, 68, 0.15)", borderColor: "rgba(239, 68, 68, 0.3)", color: "#F87171" }}>
            <AlertTriangle size={13} strokeWidth={2} />
            <span>500 — System Runtime Error</span>
          </div>

          <h1 className={styles.title}>
            Something went wrong loading this view
          </h1>

          <p className={styles.subtitle}>
            {error.message || "An unexpected application exception occurred. The system engine logged this trace automatically."}
          </p>

          <div className={styles.mainActions}>
            <button onClick={() => reset()} className={styles.primaryBtn} style={{ background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)" }}>
              <RefreshCw size={18} strokeWidth={2} />
              <span>Try Again</span>
            </button>

            <Link href="/" className={styles.secondaryBtn}>
              <LayoutGrid size={16} strokeWidth={2} />
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>

        <div className={styles.brandFooter}>
          <span className={styles.brandLogoDot} style={{ backgroundColor: "#EF4444" }} />
          <span>Real Estate CRM System · Internal System Diagnostic</span>
        </div>
      </div>
    </div>
  );
}
