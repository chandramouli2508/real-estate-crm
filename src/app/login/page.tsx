"use client";

import React, { useState, useId } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./login.module.css";

/* ── Field ── */
function Field({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  required,
  suffix,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  suffix?: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required} aria-hidden="true"> *</span>}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`${styles.input} ${error ? styles.inputError : ""} ${suffix ? styles.hasSuffix : ""}`}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {error && (
        <p id={`${id}-err`} className={styles.fieldError} role="alert">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Page ── */
export default function LoginPage() {
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Please enter a valid email address.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Password must be at least 6 characters.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    // Simulate auth
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setAuthError("Invalid email or password. Please try again.");
  }

  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 9s3-5.5 8-5.5S17 9 17 9s-3 5.5-8 5.5S1 9 1 9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 9s3-5.5 8-5.5S17 9 17 9s-3 5.5-8 5.5S1 9 1 9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2 2l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    );

  return (
    <div className={styles.page}>
      {/* ── Left brand panel ── */}
      <div className={styles.brand} aria-hidden="true">
        <div className={styles.brandInner}>
          {/* Logo */}
          <div className={styles.brandLogo}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="#2563EB"/>
              <path d="M9 20L18 10l9 10" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
              <path d="M12 26h12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className={styles.brandName}>PropFlow</span>
          </div>

          {/* Headline */}
          <div className={styles.brandHeadline}>
            <h1 className={styles.brandTitle}>
              Close more deals.<br />
              Faster.
            </h1>
            <p className={styles.brandSub}>
              The real estate CRM built for modern teams. Manage leads, listings, and clients from a single intelligent workspace.
            </p>
          </div>

          {/* Feature list */}
          <ul className={styles.featureList}>
            {[
              { icon: "📊", text: "Real-time pipeline & deal tracking" },
              { icon: "🏘️", text: "Smart property & listing management" },
              { icon: "⚡", text: "Automated follow-ups & reminders" },
            ].map((f) => (
              <li key={f.text} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          {/* Stats strip */}
          <div className={styles.stats}>
            {[
              { value: "12,000+", label: "Agents" },
              { value: "$4.2B", label: "Deals closed" },
              { value: "98%", label: "Satisfaction" },
            ].map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative geometry */}
        <div className={styles.geo1} />
        <div className={styles.geo2} />
        <div className={styles.geo3} />
      </div>

      {/* ── Right form panel ── */}
      <div className={styles.formPanel}>
        {/* Mobile-only logo */}
        <div className={styles.mobileLogo}>
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="#2563EB"/>
            <path d="M9 20L18 10l9 10" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M12 26h12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className={styles.mobileLogoName}>PropFlow</span>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTop}>
            <h2 className={styles.cardTitle}>Welcome back</h2>
            <p className={styles.cardSub}>Sign in to your PropFlow workspace</p>
          </div>

          {/* Auth error */}
          {authError && (
            <div className={styles.authError} role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="7" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.2"/>
                <path d="M8 5v4M8 10.5v.5" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              {authError}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <Field
              id={emailId}
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
              error={errors.email}
              autoComplete="email"
              required
            />

            <Field
              id={passwordId}
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
              error={errors.password}
              autoComplete="current-password"
              required
              suffix={
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                >
                  <EyeIcon open={showPassword} />
                </button>
              }
            />

            {/* Remember + Forgot */}
            <div className={styles.row}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className={styles.checkText}>Remember me</span>
              </label>
              <a href="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              id="login-submit-btn"
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className={styles.footer}>
            Don&apos;t have an account?{" "}
            <a href="/signup" className={styles.footerLink}>
              Request access
            </a>
          </p>
        </div>

        <p className={styles.legal}>
          © 2026 PropFlow. All rights reserved. ·{" "}
          <a href="/privacy" className={styles.legalLink}>Privacy</a> ·{" "}
          <a href="/terms" className={styles.legalLink}>Terms</a>
        </p>
      </div>
    </div>
  );
}
