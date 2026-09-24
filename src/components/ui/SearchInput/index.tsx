"use client";

import React from "react";
import { cn } from "@/lib/cn";
import styles from "./SearchInput.module.css";
import { Search, X } from "lucide-react";

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
          <Search size={16} strokeWidth={1.6} />
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
            <X size={14} strokeWidth={2} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
export { SearchInput };
export default SearchInput;
