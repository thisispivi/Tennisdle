import { Players, Player } from "../../../typings/Player";
import { atpPlayers } from "../../../assets";

type GuessUnlimitedWtaProps = {
  players: Players;
  playerToGuess: Player;
};

/**
 * Loader for GuessUnlimitedWta component
 * @returns {GuessUnlimitedWtaProps} - Players and player to guess
 */
export default function GuessUnlimitedWtaLoader(): GuessUnlimitedWtaProps {
  const numPlayers = atpPlayers.length;

  const getRandomPlayer = () => {
    const randomIndex = Math.floor(Math.random() * numPlayers);
    console.log(atpPlayers[randomIndex]);
    return atpPlayers[randomIndex];
  };

  return { players: atpPlayers, playerToGuess: getRandomPlayer() };
}
