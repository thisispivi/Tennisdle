import UnitedKingdomIcon from "./flags/UK-rounded.svg";
import ItalyIcon from "./flags/IT-rounded.svg";
export { UnitedKingdomIcon, ItalyIcon };

import ATPFinalsIcon from "./icons/ATPFinals.svg";
import AustralianOpenIcon from "./icons/AustralianOpen.svg";
import BirthdayCakeIcon from "./icons/BirthdayCake.svg";
import ChevronIcon from "./icons/Chevron.svg";
import CloseIcon from "./icons/Close.svg";
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
import WTAFinalsIcon from "./icons/WTAFinals.svg";
export {
  ATPFinalsIcon,
  AustralianOpenIcon,
  BirthdayCakeIcon,
  ChevronIcon,
  CloseIcon,
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
  WTAFinalsIcon,
};

import { calculateAge } from "../utils/date";
import { Players } from "../typings/Player";

import allAtpPlayersData from "./db/atp_players.json";
const allAtpPlayers: Players = allAtpPlayersData.map((player) => ({
  ...player,
  birthDate: calculateAge(player.birthDate),
}));

import atpPlayersData from "./db/atp_players_filtered.json";
const atpPlayers: Players = atpPlayersData.map((player) => ({
  ...player,
  birthDate: calculateAge(player.birthDate),
}));

import allWtaPlayersData from "./db/wta_players.json";
const allWtaPlayers: Players = allWtaPlayersData.map((player) => ({
  ...player,
  birthDate: calculateAge(player.birthDate),
}));

import wtaPlayersData from "./db/wta_players_filtered.json";
const wtaPlayers: Players = wtaPlayersData.map((player) => ({
  ...player,
  birthDate: calculateAge(player.birthDate),
}));

export { allAtpPlayers, atpPlayers, allWtaPlayers, wtaPlayers };

import { Schedule } from "../typings/Schedule";
import scheduleData from "./db/player_schedule.json";
const schedule: Schedule[] = scheduleData.map((schedule) => ({
  ...schedule,
  date: new Date(schedule.date),
}));
export { schedule };
