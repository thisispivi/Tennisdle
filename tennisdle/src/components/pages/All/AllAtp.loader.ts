import { atpPlayers } from "../../../assets";
import { Players } from "../../../typings/Player";

type AllAtpProps = { players: Players };

export default function AllAtpLoader(): AllAtpProps {
  return {
    players: atpPlayers.sort(
      (a, b) => (b.yearTurnedPro || 0) - (a.yearTurnedPro || 0)
    ),
  };
}
