import { DailyGame } from "../../../typings/DailyGame";
import { getDateAsKey } from "../../../utils/date";
import { RootState } from "../../store";

/**
 * Retrieves the daily game for either ATP or WTA based on the current date.
 *
 * @param {RootState["daily"]} daily - The daily state from the Redux store.
 * @param {boolean} isAtp - A boolean indicating whether to retrieve ATP (true) or WTA (false) games.
 * @returns {DailyGame} The game object for the current date.
 */
export const retrieveDailyGame = (
  daily: RootState["daily"],
  isAtp: boolean
): DailyGame => {
  return daily[isAtp ? "atpGames" : "wtaGames"][getDateAsKey()];
};

/**
 * Calculates the winning streak for either ATP or WTA games.
 *
 * @param {RootState["daily"]} daily - The daily state from the Redux store.
 * @param {boolean} isAtp - A boolean indicating whether to calculate the streak for ATP (true) or WTA (false) games.
 * @returns {number} The number of consecutive days with a win.
 */
export const calculateWinningStreak = (
  daily: RootState["daily"],
  isAtp: boolean
): number => {
  const games = daily[isAtp ? "atpGames" : "wtaGames"];
  const date = new Date();

  const currentGame = games[getDateAsKey(date)];
  const isCurrentGameWon = currentGame?.isWon;
  const isCurrentGameLost = currentGame?.lives === 0;

  const calculateStreak = (date: Date, streak: number): number => {
    date.setDate(date.getDate() - 1);
    const dateKey = getDateAsKey(date);
    const game = games[dateKey];
    if (!game || !game.isWon) return streak;
    return calculateStreak(date, streak + 1);
  };

  return isCurrentGameLost
    ? 0
    : calculateStreak(date, isCurrentGameWon ? 1 : 0);
};
