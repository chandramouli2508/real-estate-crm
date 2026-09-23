"use client";

import React from "react";
import { cn } from "@/lib/cn";
import styles from "./DateInput.module.css";

export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, hint, error, fullWidth = false, className, id, ...props }, ref) => {
    const inputId = id ?? `date-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}> *</span>}
          </label>
        )}
        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="2.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.25"/>
              <path d="M5 1v3M11 1v3M1.5 6.5h13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            ref={ref}
            type="date"
            id={inputId}
            className={cn(styles.input, error && styles.inputError, className)}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className={styles.error} role="alert">{error}</p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className={styles.hint}>{hint}</p>
        )}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";
export { DateInput };
export default DateInput;
