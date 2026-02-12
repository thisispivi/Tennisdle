import { atpPlayers } from "../../../assets";
import { Players } from "../../../typings/Player";

type GuessUnlimitedAtpProps = { players: Players; isAtp: boolean };

/**
 * Loader for GuessUnlimitedAtp component
 * @returns {GuessUnlimitedAtpProps} - Players and player to guess
 */
export default function GuessUnlimitedAtpLoader(): GuessUnlimitedAtpProps {
  return { players: atpPlayers, isAtp: true };
}
