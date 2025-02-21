/**
 * Calculate the age of a person based on the birth date
 * @param {number | string} birthDate - The birth date of the person
 * @returns {number} The age of the person
 */
export function calculateAge(birthDate: number | string): number {
  const age_dt = new Date(Date.now() - new Date(birthDate).getTime());
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

/**
 * Check if a given date is today
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is today, false otherwise
 */
export function isDateToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if two dates are equal
 * @param {Date} date1 - The first date
 * @param {Date} date2 - The second date
 * @returns {boolean} True if the dates are equal, false otherwise
 */
export function isDatesEqual(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Get a date as a string key
 * @param {Date} [date] - The date to get as a key
 * @returns {string} The date as a key
 */
export function getDateAsKey(date: Date = new Date()): string {
  return `${date.getDate() + 1}-${date.getMonth() + 1}-${date.getFullYear()}`;
}
