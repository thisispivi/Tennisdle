import { atpPlayers } from "../../../assets";
import { Player, Players } from "../../../typings/Player";
import { getDailyIndex } from "../../../utils/date";

type GuessDailyAtpProps = {
  players: Players;
  playerToGuess: Player;
  isAtp: boolean;
};

export default function GuessDailyAtpLoader(): GuessDailyAtpProps {
  const player = atpPlayers[getDailyIndex(17) % atpPlayers.length];
  if (!player) throw new Error("Player not found");

  return { players: atpPlayers, playerToGuess: player, isAtp: true };
}
