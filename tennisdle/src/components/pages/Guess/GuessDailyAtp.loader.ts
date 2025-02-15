import { Players, Player } from "../../../typings/Player";
import { atpPlayers } from "../../../assets";

type GuessDailyAtpProps = {
  players: Players;
  playerToGuess: Player;
};

/**
 * Loader for GuessDailyAtp component
 * @returns {GuessDailyAtpProps} - Players and player to guess
 */
export default function GuessDailyAtpLoader(): GuessDailyAtpProps {
  const numPlayers = atpPlayers.length;

  const getRandomPlayer = () => {
    const randomIndex = Math.floor(Math.random() * numPlayers);
    console.log(atpPlayers[randomIndex]);
    return atpPlayers[randomIndex];
  };

  return { players: atpPlayers, playerToGuess: getRandomPlayer() };
}
