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
