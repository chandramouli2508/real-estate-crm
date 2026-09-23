"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";
import styles from "./Tabs.module.css";

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  className?: string;
  children?: React.ReactNode;
}

function Tabs({
  items,
  activeKey: controlledKey,
  defaultActiveKey,
  onChange,
  className,
  children,
}: TabsProps) {
  const [internalKey, setInternalKey] = useState(
    defaultActiveKey ?? items[0]?.key ?? ""
  );
  const active = controlledKey ?? internalKey;

  function handleClick(key: string) {
    if (!controlledKey) setInternalKey(key);
    onChange?.(key);
  }

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.tabList} role="tablist">
        {items.map((item) => (
          <button
            key={item.key}
            role="tab"
            aria-selected={active === item.key}
            aria-controls={`tabpanel-${item.key}`}
            id={`tab-${item.key}`}
            disabled={item.disabled}
            className={cn(
              styles.tab,
              active === item.key && styles.active,
              item.disabled && styles.disabled
            )}
            onClick={() => !item.disabled && handleClick(item.key)}
          >
            {item.icon && <span className={styles.tabIcon}>{item.icon}</span>}
            {item.label}
            {item.badge !== undefined && (
              <span className={styles.tabBadge}>{item.badge}</span>
            )}
          </button>
        ))}
      </div>
      {children && (
        <div className={styles.tabContent}>
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;
            const panelKey = (child.props as { tabKey?: string }).tabKey;
            return (
              <div
                role="tabpanel"
                id={`tabpanel-${panelKey}`}
                aria-labelledby={`tab-${panelKey}`}
                hidden={active !== panelKey}
              >
                {child}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { Tabs };
export default Tabs;
