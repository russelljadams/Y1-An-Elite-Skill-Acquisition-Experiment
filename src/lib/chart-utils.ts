export function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toFixed(1).padStart(4, "0")}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateByGranularity(
  dateStr: string,
  granularity: "day" | "week" | "month"
): string {
  if (granularity === "month") {
    const [year, month] = dateStr.split("-");
    const d = new Date(Number(year), Number(month) - 1);
    return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  }
  const d = new Date(dateStr + "T00:00:00");
  if (granularity === "week") {
    return "w/" + d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: "rgba(18, 21, 30, 0.85)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  padding: "8px 12px",
  fontSize: 12,
};

export const GRID_STROKE = "hsl(222, 20%, 15%)";

export const TICK_STYLE = {
  fontSize: 11,
  fill: "hsl(var(--muted-foreground))",
};

export const COLORS = {
  cyan: "hsl(187, 80%, 53%)",
  orange: "hsl(24, 95%, 53%)",
  emerald: "hsl(160, 84%, 39%)",
  violet: "hsl(263, 70%, 58%)",
  red: "hsl(0, 84%, 60%)",
  amber: "hsl(38, 92%, 50%)",
  muted: "hsl(222, 20%, 40%)",
} as const;
