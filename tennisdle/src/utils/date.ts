/**
 * Calculate the age of a person based on the birth date
 * @param {number} birthDate - The birth date of the person
 * @returns {number} The age of the person
 */
export function calculateAge(birthDate: number): number {
  const age_dt = new Date(Date.now() - new Date(birthDate).getTime());
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}
