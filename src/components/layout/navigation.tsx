"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "home" },
  { href: "/method", label: "method" },
  { href: "/progress", label: "progress" },
  { href: "/log", label: "log" },
  { href: "/journal", label: "journal" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-bold tracking-tight">
          Russell J. Adams
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-xs transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-[hsl(var(--accent))]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
