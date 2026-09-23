/**
 * Lightweight className merge helper.
 * Filters falsy values and joins with a space.
 * Use instead of a heavy library like clsx/classnames.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
