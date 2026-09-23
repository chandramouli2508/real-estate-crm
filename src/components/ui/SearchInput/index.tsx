"use client";

import React from "react";
import { cn } from "@/lib/cn";
import styles from "./SearchInput.module.css";

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
  fullWidth?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, fullWidth = false, className, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== "";

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
        <span className={styles.searchIcon} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(styles.input, hasValue && styles.hasValue, className)}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={onClear}
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
export { SearchInput };
export default SearchInput;
