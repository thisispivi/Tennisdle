import UnitedKingdomIcon from "./flags/UK-rounded.svg";
import ItalyIcon from "./flags/IT-rounded.svg";
export { UnitedKingdomIcon, ItalyIcon };

import ATPFinalsIcon from "./icons/ATPFinals.svg";
import AustralianOpenIcon from "./icons/AustralianOpen.svg";
import BirthdayCakeIcon from "./icons/BirthdayCake.svg";
import ChevronIcon from "./icons/Chevron.svg";
import CountryIcon from "./icons/Country.svg";
import CupIcon from "./icons/Cup.svg";
import FrenchOpenIcon from "./icons/FrenchOpen.svg";
import HeightIcon from "./icons/Height.svg";
import Logo from "./icons/Logo.svg";
import LogoText from "./icons/LogoText.svg";
import OlympicsIcon from "./icons/Olympics.svg";
import RankingIcon from "./icons/Ranking.svg";
import TriangleIcon from "./icons/Triangle.svg";
import TurnedProIcon from "./icons/TurnedPro.svg";
import USOpenIcon from "./icons/USOpen.svg";
import WimbledonIcon from "./icons/Wimbledon.svg";
export {
  ATPFinalsIcon,
  AustralianOpenIcon,
  BirthdayCakeIcon,
  ChevronIcon,
  CountryIcon,
  CupIcon,
  FrenchOpenIcon,
  HeightIcon,
  Logo,
  LogoText,
  OlympicsIcon,
  RankingIcon,
  TriangleIcon,
  TurnedProIcon,
  USOpenIcon,
  WimbledonIcon,
};

import { calculateAge } from "../utils/date";
import playersData from "./db/atp_players.json";
import { Players } from "../typings/Player";
const atpPlayers: Players = playersData
  .map((player) => ({
    ...player,
    birthDate: calculateAge(player.birthDate),
  }))
  .filter(
    (player) =>
      !(
        player.yearTurnedPro &&
        player.yearTurnedPro < 2000 &&
        player.careerTitles < 30
      )
  );

console.log(atpPlayers.length);
export { atpPlayers };
