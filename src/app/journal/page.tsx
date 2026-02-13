import { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "journal",
  description: "Practice reflections and notes.",
};

type JournalEntry = {
  date: string;
  title: string;
  body: string;
};

function loadEntries(): JournalEntry[] {
  const filePath = path.join(process.cwd(), "public", "data", "journal.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as JournalEntry[];
}

export default function JournalPage() {
  const entries = loadEntries();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12">
        <h1 className="text-2xl font-bold mb-4">Journal</h1>
        <p className="text-muted-foreground text-sm">
          Practice notes, reflections, and things I&apos;m working on.
        </p>
      </header>

      {!entries.length ? (
        <div className="glass p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No journal entries yet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {entries.map((entry) => (
            <article key={entry.date} className="glass p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">{entry.title}</h2>
                <time className="text-xs text-muted-foreground font-mono">
                  {entry.date}
                </time>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {entry.body}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
