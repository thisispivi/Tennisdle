import UnitedKingdomIcon from "./flags/UnitedKingdom.svg";
import ItalyIcon from "./flags/Italy.svg";
export { UnitedKingdomIcon, ItalyIcon };

import ATPFinalsIcon from "./icons/ATPFinals.svg";
import AustralianOpenIcon from "./icons/AustralianOpen.svg";
import ChevronIcon from "./icons/Chevron.svg";
import CupIcon from "./icons/Cup.svg";
import FrenchOpenIcon from "./icons/FrenchOpen.svg";
import OlympicsIcon from "./icons/Olympics.svg";
import RankingIcon from "./icons/Ranking.svg";
import TriangleIcon from "./icons/Triangle.svg";
import USOpenIcon from "./icons/USOpen.svg";
import WimbledonIcon from "./icons/Wimbledon.svg";
export {
  ATPFinalsIcon,
  AustralianOpenIcon,
  ChevronIcon,
  CupIcon,
  FrenchOpenIcon,
  OlympicsIcon,
  RankingIcon,
  TriangleIcon,
  USOpenIcon,
  WimbledonIcon,
};

import playersData from "./db/atp_players.json";
import { Players } from "data/typings/Player";
const players: Players = playersData;
export { players };
