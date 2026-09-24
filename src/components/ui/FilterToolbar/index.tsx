"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { SearchInput } from "@/components/ui/SearchInput";
import styles from "./FilterToolbar.module.css";
import { RotateCcw } from "lucide-react";

export interface FilterToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  children?: React.ReactNode;
  className?: string;
}

function FilterToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  hasActiveFilters = false,
  onClearFilters,
  children,
  className,
}: FilterToolbarProps) {
  return (
    <div className={cn(styles.toolbar, className)}>
      {onSearchChange !== undefined && (
        <div className={styles.searchSection}>
          <SearchInput
            value={searchValue ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            placeholder={searchPlaceholder}
          />
        </div>
      )}

      {children && (
        <div className={styles.filtersSection}>
          {React.Children.map(children, (child) => {
            if (!child) return null;
            return <div className={styles.item}>{child}</div>;
          })}

          {hasActiveFilters && onClearFilters && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={onClearFilters}
              title="Reset all filters"
            >
              <RotateCcw size={13} strokeWidth={1.8} />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export { FilterToolbar };
export default FilterToolbar;
