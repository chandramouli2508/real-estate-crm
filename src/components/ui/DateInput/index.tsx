"use client";

import React, { useId } from "react";
import { cn } from "@/lib/cn";
import styles from "./DateInput.module.css";
import { Calendar } from "lucide-react";

export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, hint, error, fullWidth = false, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

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
            <Calendar size={16} strokeWidth={1.6} />
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
