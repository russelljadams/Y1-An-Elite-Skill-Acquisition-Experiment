import { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "log",
  description: "Auto-generated session log from telemetry data.",
};

type DailyData = {
  date: string;
  sessions: number;
  laps: number;
  durationHours: number;
  resets: number;
  tracks: Record<
    string,
    {
      sessions: number;
      laps: number;
      durationHours: number;
      resets: number;
    }
  >;
};

function loadAllDays(): DailyData[] {
  const dailyDir = path.join(process.cwd(), "public", "data", "daily");
  if (!fs.existsSync(dailyDir)) return [];
  const files = fs
    .readdirSync(dailyDir)
    .filter((n) => n.endsWith(".json"))
    .sort()
    .reverse();
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dailyDir, file), "utf-8");
    return JSON.parse(raw) as DailyData;
  });
}

export default function LogPage() {
  const days = loadAllDays();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12">
        <h1 className="text-2xl font-bold mb-4">Session log</h1>
        <p className="text-muted-foreground text-sm">
          Auto-generated from telemetry data. Every practice day, reverse
          chronological.
        </p>
      </header>

      {!days.length ? (
        <div className="glass p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No sessions logged yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {days.map((day) => (
            <div key={day.date} className="glass p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium font-mono">{day.date}</span>
                <span className="text-xs text-muted-foreground">
                  {day.sessions} session{day.sessions !== 1 ? "s" : ""} &middot;{" "}
                  {day.durationHours}h &middot; {day.laps} laps
                  {day.resets > 0 ? ` \u00b7 ${day.resets} resets` : ""}
                </span>
              </div>
              {Object.keys(day.tracks).length > 1 && (
                <div className="space-y-1 mt-2 pl-3 border-l border-white/[0.06]">
                  {Object.entries(day.tracks).map(([trackName, t]) => (
                    <div
                      key={trackName}
                      className="flex justify-between text-xs text-muted-foreground"
                    >
                      <span className="capitalize">{trackName}</span>
                      <span>
                        {t.sessions}s &middot; {t.durationHours}h &middot;{" "}
                        {t.laps} laps
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
