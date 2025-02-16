import { Players, Player } from "../../../typings/Player";
import { wtaPlayers, schedule } from "../../../assets";
import { isDatesEqual } from "../../../utils/date";

type GuessDailyWtaProps = {
  players: Players;
  playerToGuess: Player;
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

  return { players: wtaPlayers, playerToGuess: player };
}
