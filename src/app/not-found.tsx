import React from "react";
import Link from "next/link";
import styles from "./not-found.module.css";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className={styles.container}>
      {/* Background Grid Pattern */}
      <div className={styles.gridPattern} aria-hidden="true" />

      {/* Ambient Ghost Watermark */}
      <div className={styles.ghostText} aria-hidden="true">
        404
      </div>

      {/* Compact Card */}
      <div className={styles.card}>
        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>404 — Page Not Found</span>
        </div>

        {/* Message */}
        <p className={styles.description}>
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* Action */}
        <Link href="/" className={styles.primaryBtn}>
          <ArrowLeft size={16} strokeWidth={2} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
