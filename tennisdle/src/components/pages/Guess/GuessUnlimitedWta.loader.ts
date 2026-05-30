import { wtaPlayers } from "../../../assets";
import { Players } from "../../../typings/Player";

type GuessUnlimitedWtaProps = { players: Players; isAtp: boolean };

export default function GuessUnlimitedWtaLoader(): GuessUnlimitedWtaProps {
  return { players: wtaPlayers, isAtp: false };
}
