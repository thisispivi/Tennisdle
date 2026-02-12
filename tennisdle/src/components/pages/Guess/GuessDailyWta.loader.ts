import { schedule,wtaPlayers } from "../../../assets";
import { Player,Players } from "../../../typings/Player";
import { isDatesEqual } from "../../../utils/date";

type GuessDailyWtaProps = {
  players: Players;
  playerToGuess: Player;
  isAtp: boolean;
};

/**
 * Loader for GuessDailyWta component
 * @returns {GuessDailyWtaProps} - Players and player to guess
 */
export default function GuessDailyWtaLoader(): GuessDailyWtaProps {
  const playerKey = schedule.find((s) =>
    isDatesEqual(s.date, new Date())
  )?.wtaPlayer;

  const player = wtaPlayers.find((p) => p.player === playerKey);
  if (!player) throw new Error("Player not found");

  console.log(player);

  return { players: wtaPlayers, playerToGuess: player, isAtp: false };
}
