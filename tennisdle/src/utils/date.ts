export function calculateAge(birthDate: number | string): number {
  const age_dt = new Date(Date.now() - new Date(birthDate).getTime());
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export function isDateToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isDatesEqual(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function getDateAsKey(date: Date = new Date()): string {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

export function getDailyIndex(seed: number = 0): number {
  const now = new Date();
  const epoch = new Date(2025, 0, 1);
  const diffDays = Math.floor(
    (now.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays + seed;
}

export function getISODateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getISOWeekParts(date: Date = new Date()): {
  week: number;
  year: number;
} {
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  return { week, year: utcDate.getUTCFullYear() };
}

export function getWeeklyContentFilename(
  prefix: "top10" | "grid_puzzles",
  date: Date = new Date()
): string {
  const { week, year } = getISOWeekParts(date);
  return `${prefix}_${`${week}`.padStart(2, "0")}_${year}.json`;
}
