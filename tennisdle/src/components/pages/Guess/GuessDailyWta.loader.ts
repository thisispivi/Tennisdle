import { Players, Player } from "../../../data/typings/Player";
import { atpPlayers } from "../../../assets";

type GuessDailyWtaProps = {
  players: Players;
  playerToGuess: Player;
};

/**
 * Loader for GuessDailyWta component
 * @returns {GuessDailyWtaProps} - Players and player to guess
 */
export default function GuessDailyWtaLoader(): GuessDailyWtaProps {
  const numPlayers = atpPlayers.length;

  const getRandomPlayer = () => {
    const randomIndex = Math.floor(Math.random() * numPlayers);
    console.log(atpPlayers[randomIndex]);
    return atpPlayers[randomIndex];
  };

  return { players: atpPlayers, playerToGuess: getRandomPlayer() };
}
