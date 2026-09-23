import React from "react";
import { cn } from "@/lib/cn";
import styles from "./PageHeader.module.css";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  className?: string;
}

function PageHeader({ title, subtitle, breadcrumb, actions, className }: PageHeaderProps) {
  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.left}>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className={styles.crumbItem}>
                {crumb.href ? (
                  <a href={crumb.href} className={styles.crumbLink}>
                    {crumb.label}
                  </a>
                ) : (
                  <span className={styles.crumbCurrent} aria-current="page">
                    {crumb.label}
                  </span>
                )}
                {i < breadcrumb.length - 1 && (
                  <span className={styles.crumbSeparator} aria-hidden="true">/</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && (
        <div className={styles.actions}>{actions}</div>
      )}
    </div>
  );
}

export { PageHeader };
export default PageHeader;
