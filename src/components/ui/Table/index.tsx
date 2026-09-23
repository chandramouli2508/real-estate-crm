import React from "react";
import { cn } from "@/lib/cn";
import styles from "./Table.module.css";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  keyField?: string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
}

function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = "id",
  loading = false,
  emptyMessage = "No data found",
  className,
  onRowClick,
  sortKey,
  sortDir,
  onSort,
}: TableProps<T>) {
  return (
    <div className={cn(styles.wrapper, className)}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  styles.th,
                  col.align && styles[`align-${col.align}`],
                  col.sortable && styles.sortable
                )}
                style={col.width ? { width: col.width } : undefined}
                onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                aria-sort={
                  sortKey === col.key
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <span className={styles.thContent}>
                  {col.title}
                  {col.sortable && (
                    <span className={styles.sortIcon} aria-hidden="true">
                      {sortKey === col.key ? (
                        sortDir === "asc" ? (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 2l4 8H2z" fill="currentColor"/>
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 10L2 2h8z" fill="currentColor"/>
                          </svg>
                        )
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 2l3 4H3zM6 10L3 6h6z" fill="currentColor" opacity="0.4"/>
                        </svg>
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className={styles.row}>
                  {columns.map((col) => (
                    <td key={col.key} className={styles.td}>
                      <span className={`${styles.skeletonCell} skeleton`} />
                    </td>
                  ))}
                </tr>
              ))
            : data.length === 0
            ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  {emptyMessage}
                </td>
              </tr>
            )
            : data.map((row, i) => (
                <tr
                  key={String(row[keyField] ?? i)}
                  className={cn(styles.row, onRowClick && styles.clickable)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        styles.td,
                        col.align && styles[`align-${col.align}`]
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key], row, i)
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

export { Table };
export default Table;
