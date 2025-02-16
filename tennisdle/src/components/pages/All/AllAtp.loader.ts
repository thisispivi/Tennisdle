import { Players } from "../../../typings/Player";
import { atpPlayers } from "../../../assets";

type AllAtpProps = { players: Players };

/**
 * Loader for AllAtp component
 * @returns {AllAtpProps} - All ATP players
 */
export default function AllAtpLoader(): AllAtpProps {
  return {
    players: atpPlayers.sort(
      (a, b) => (b.yearTurnedPro || 0) - (a.yearTurnedPro || 0)
    ),
  };
}
