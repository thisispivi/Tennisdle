import { atpPlayers } from "../../../assets";
import { Players } from "../../../typings/Player";

type GuessImageAtpProps = { players: Players; isAtp: boolean };

export default function GuessImageAtpLoader(): GuessImageAtpProps {
  return { players: atpPlayers.filter((p) => p.image && p.image.length > 0), isAtp: true };
}
