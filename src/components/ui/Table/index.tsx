"use client";

import React from "react";
import { cn } from "@/lib/cn";
import styles from "./Table.module.css";
import { ArrowUp, ArrowDown, ArrowUpDown, Inbox } from "lucide-react";

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
  stickyHeader?: boolean;
  striped?: boolean;
}

function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = "id",
  loading = false,
  emptyMessage = "No data available",
  className,
  onRowClick,
  sortKey,
  sortDir,
  onSort,
  stickyHeader = false,
  striped = false,
}: TableProps<T>) {
  return (
    <div className={cn(styles.wrapper, className)}>
      <table className={cn(styles.table, striped && styles.striped)}>
        <thead className={cn(stickyHeader && styles.stickyHeader)}>
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
                <div className={styles.thContent}>
                  <span>{col.title}</span>
                  {col.sortable && (
                    <span className={styles.sortIcon} aria-hidden="true">
                      {sortKey === col.key ? (
                        sortDir === "asc" ? (
                          <ArrowUp size={13} strokeWidth={2} />
                        ) : (
                          <ArrowDown size={13} strokeWidth={2} />
                        )
                      ) : (
                        <ArrowUpDown size={13} strokeWidth={1.5} className={styles.sortInactive} />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className={styles.row}>
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    <span className={`${styles.skeletonCell} skeleton`} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                <div className={styles.emptyStateContainer}>
                  <Inbox size={32} strokeWidth={1.2} className={styles.emptyIcon} />
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export { Table };
export default Table;
