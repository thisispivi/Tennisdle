import { Players } from "../../../typings/Player";
import { wtaPlayers } from "../../../assets";

type AllWtaProps = { players: Players };

/**
 * Loader for AllWta component
 * @returns {AllWtaProps} - All ATP players
 */
export default function AllWtaLoader(): AllWtaProps {
  return {
    players: wtaPlayers.sort(
      (a, b) => (b.yearTurnedPro || 0) - (a.yearTurnedPro || 0)
    ),
  };
}
