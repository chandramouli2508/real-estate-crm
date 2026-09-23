import React from "react";
import styles from "./LoadingState.module.css";

export interface LoadingStateProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

function LoadingState({ rows = 5, columns = 4, showHeader = true }: LoadingStateProps) {
  return (
    <div className={styles.wrapper} aria-busy="true" aria-label="Loading content">
      {showHeader && (
        <div className={styles.header}>
          <span className={`${styles.block} skeleton`} style={{ width: "180px", height: "24px" }} />
          <span className={`${styles.block} skeleton`} style={{ width: "100px", height: "36px" }} />
        </div>
      )}
      <div className={styles.rows}>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className={styles.row}>
            {Array.from({ length: columns }).map((_, c) => (
              <span
                key={c}
                className={`${styles.block} skeleton`}
                style={{
                  flex: c === 0 ? "0 0 40px" : "1",
                  height: "16px",
                  borderRadius: c === 0 ? "50%" : undefined,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export { LoadingState };
export default LoadingState;
