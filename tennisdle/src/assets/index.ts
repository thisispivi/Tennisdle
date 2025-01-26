import UnitedKingdomIcon from "./flags/UnitedKingdom.svg";
import ItalyIcon from "./flags/Italy.svg";
export { UnitedKingdomIcon, ItalyIcon };

import ChevronIcon from "./icons/Chevron.svg";
import TriangleIcon from "./icons/Triangle.svg";
export { ChevronIcon, TriangleIcon };

import playersData from "./db/atp_players.json";
import { Players } from "data/typings/Player";
const players: Players = playersData;
export { players };
