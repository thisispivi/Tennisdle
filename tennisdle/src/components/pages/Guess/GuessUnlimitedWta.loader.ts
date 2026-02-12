import { wtaPlayers } from "../../../assets";
import { Players } from "../../../typings/Player";

type GuessUnlimitedWtaProps = { players: Players; isAtp: boolean };

/**
 * Loader for GuessUnlimitedWta component
 * @returns {GuessUnlimitedWtaProps} - Players and player to guess
 */
export default function GuessUnlimitedWtaLoader(): GuessUnlimitedWtaProps {
  return { players: wtaPlayers, isAtp: false };
}
