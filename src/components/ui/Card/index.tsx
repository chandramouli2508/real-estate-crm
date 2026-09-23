import React from "react";
import { cn } from "@/lib/cn";
import styles from "./Card.module.css";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  shadow?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  hover?: boolean;
}

function Card({
  padded = true,
  shadow = "sm",
  border = true,
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        styles.card,
        padded && styles.padded,
        border && styles.border,
        shadow !== "none" && styles[`shadow-${shadow}`],
        hover && styles.hover,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn(styles.header, className)} {...props}>
      {children}
    </div>
  );
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={cn(styles.body, className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn(styles.footer, className)} {...props}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card, CardHeader, CardBody, CardFooter };
export default Card;
