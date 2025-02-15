import { Players, Player } from "../../../typings/Player";
import { atpPlayers } from "../../../assets";

type GuessUnlimitedAtpProps = {
  players: Players;
  playerToGuess: Player;
};

/**
 * Loader for GuessUnlimitedAtp component
 * @returns {GuessUnlimitedAtpProps} - Players and player to guess
 */
export default function GuessUnlimitedAtpLoader(): GuessUnlimitedAtpProps {
  const numPlayers = atpPlayers.length;

  const getRandomPlayer = () => {
    const randomIndex = Math.floor(Math.random() * numPlayers);
    console.log(atpPlayers[randomIndex]);
    return atpPlayers[randomIndex];
  };

  return { players: atpPlayers, playerToGuess: getRandomPlayer() };
}
