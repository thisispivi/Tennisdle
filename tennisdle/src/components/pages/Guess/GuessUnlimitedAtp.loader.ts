import { atpPlayers } from "../../../assets";
import { Players } from "../../../typings/Player";

type GuessUnlimitedAtpProps = { players: Players; isAtp: boolean };

export default function GuessUnlimitedAtpLoader(): GuessUnlimitedAtpProps {
  return { players: atpPlayers, isAtp: true };
}
