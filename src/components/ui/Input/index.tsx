"use client";

import React from "react";
import { cn } from "@/lib/cn";
import styles from "./Input.module.css";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, hint, error, iconLeft, iconRight, fullWidth = false, className, id, ...props },
    ref
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required} aria-hidden="true"> *</span>}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {iconLeft && <span className={styles.iconLeft} aria-hidden="true">{iconLeft}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              styles.input,
              error ? styles.inputError : undefined,
              iconLeft ? styles.hasIconLeft : undefined,
              iconRight ? styles.hasIconRight : undefined,
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          {iconRight && <span className={styles.iconRight} aria-hidden="true">{iconRight}</span>}
        </div>
        {error && (
          <p id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className={styles.hint}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
export default Input;
