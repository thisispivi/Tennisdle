import { GridPuzzle } from "../typings/Grid";
import { LocalizedText, Top10Game } from "../typings/Top10";
import { getDailyIndex, getISODateKey, getWeeklyContentFilename } from "./date";

const top10Files = import.meta.glob("../assets/db/top10_*.json", {
  eager: true,
  import: "default",
});

const gridPuzzleFiles = import.meta.glob("../assets/db/grid_puzzles_*.json", {
  eager: true,
  import: "default",
});

type WeeklyPrefix = "top10" | "grid_puzzles";

/**
 * Resolve a localized database label using Tennisdle's short locale codes.
 */
export function getLocalizedText(
  value: LocalizedText,
  locale: string
): string {
  const localeKey = locale.includes("it") ? "it-IT" : "en-US";
  return value[localeKey] ?? value["en-US"];
}

/**
 * Load the current ISO-week artifact, falling back to the newest bundled file
 * so the app remains playable if a future week has not been published yet.
 */
function getWeeklyData<T>(
  files: Record<string, unknown>,
  prefix: WeeklyPrefix
): T[] {
  const expectedFilename = getWeeklyContentFilename(prefix);
  const expectedEntry = Object.entries(files).find(([path]) =>
    path.endsWith(expectedFilename)
  );

  if (expectedEntry) return expectedEntry[1] as T[];

  const latestEntry = Object.entries(files)
    .map(([path, data]) => ({ path, data }))
    .sort((a, b) => a.path.localeCompare(b.path))
    .at(-1);

  if (!latestEntry) {
    throw new Error(`No weekly ${prefix} content files found.`);
  }

  return latestEntry.data as T[];
}

/**
 * Return all Top 10 games for the selected ISO week.
 */
export function getWeeklyTop10Games(): Top10Game[] {
  return getWeeklyData<Top10Game>(top10Files, "top10");
}

/**
 * Return the Top 10 game selected for the current day.
 */
export function getCurrentTop10Game(games: Top10Game[]): Top10Game {
  const datedGame = games.find((game) => game.date === getISODateKey());
  return datedGame ?? games[getDailyIndex(300) % games.length];
}

/**
 * Return the daily grid puzzle from the selected ISO-week artifact.
 */
export function getCurrentGridPuzzle(): GridPuzzle {
  const puzzles = getWeeklyData<GridPuzzle>(gridPuzzleFiles, "grid_puzzles");
  const todayKey = getISODateKey();
  return puzzles.find((puzzle) => puzzle.date === todayKey) ?? puzzles[0];
}
