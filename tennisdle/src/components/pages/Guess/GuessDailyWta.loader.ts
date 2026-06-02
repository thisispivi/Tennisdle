import { wtaPlayers } from "../../../assets";
import { Player, Players } from "../../../typings/Player";
import { getDailyIndex } from "../../../utils/date";

type GuessDailyWtaProps = {
  players: Players;
  playerToGuess: Player;
  isAtp: boolean;
};

export default function GuessDailyWtaLoader(): GuessDailyWtaProps {
  const player = wtaPlayers[getDailyIndex(53) % wtaPlayers.length];
  if (!player) throw new Error("Player not found");

  return { players: wtaPlayers, playerToGuess: player, isAtp: false };
}
