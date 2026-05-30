import { atpPlayers, schedule } from "../../../assets";
import { Player,Players } from "../../../typings/Player";
import { isDatesEqual } from "../../../utils/date";

type GuessDailyAtpProps = {
  players: Players;
  playerToGuess: Player;
  isAtp: boolean;
};

export default function GuessDailyAtpLoader(): GuessDailyAtpProps {
  const playerKey = schedule.find((s) =>
    isDatesEqual(s.date, new Date())
  )?.atpPlayer;

  const player = atpPlayers.find((p) => p.player === playerKey);
  if (!player) throw new Error("Player not found");

  return { players: atpPlayers, playerToGuess: player, isAtp: true };
}
