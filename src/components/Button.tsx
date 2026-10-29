import type { ReactNode } from "react";

// Vocs 2 dropped its Button export; this keeps the v1 call sites (href, target, size, className) working.
export function Button({
  href,
  target,
  size = "md",
  className = "",
  children,
}: {
  href: string;
  target?: string;
  size?: "md" | "lg";
  className?: string;
  children: ReactNode;
}) {
  const sizing = size === "lg" ? "px-5 py-2.5 text-base" : "px-4 py-2 text-sm";
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      className={`not-prose inline-flex items-center rounded-md font-semibold no-underline! transition-opacity hover:opacity-85 ${sizing} ${className}`}
    >
      {children}
    </a>
  );
}
