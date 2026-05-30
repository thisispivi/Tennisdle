import { wtaPlayers } from "../../../assets";
import { Players } from "../../../typings/Player";

type GuessImageWtaProps = { players: Players; isAtp: boolean };

export default function GuessImageWtaLoader(): GuessImageWtaProps {
  return { players: wtaPlayers.filter((p) => p.image && p.image.length > 0), isAtp: false };
}
