import { atpPlayers, schedule } from "../../../assets";
import { Player,Players } from "../../../typings/Player";
import { isDatesEqual } from "../../../utils/date";

type GuessDailyAtpProps = {
  players: Players;
  playerToGuess: Player;
  isAtp: boolean;
};

/**
 * Loader for GuessDailyAtp component
 * @returns {GuessDailyAtpProps} - Players and player to guess
 */
export default function GuessDailyAtpLoader(): GuessDailyAtpProps {
  const playerKey = schedule.find((s) =>
    isDatesEqual(s.date, new Date())
  )?.atpPlayer;

  const player = atpPlayers.find((p) => p.player === playerKey);
  if (!player) throw new Error("Player not found");

  console.log(player);

  return { players: atpPlayers, playerToGuess: player, isAtp: true };
}
