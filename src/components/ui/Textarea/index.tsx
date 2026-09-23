"use client";

import React from "react";
import { cn } from "@/lib/cn";
import styles from "./Textarea.module.css";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, fullWidth = false, className, id, ...props }, ref) => {
    const textareaId = id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required} aria-hidden="true"> *</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(styles.textarea, error && styles.textareaError, className)}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : hint
              ? `${textareaId}-hint`
              : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className={styles.error} role="alert">{error}</p>
        )}
        {!error && hint && (
          <p id={`${textareaId}-hint`} className={styles.hint}>{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
export default Textarea;
