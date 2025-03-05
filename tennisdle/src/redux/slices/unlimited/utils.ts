import { UnlimitedGame } from "../../../typings/UnlimitedGame";
import { RootState } from "../../../redux/store";

export const retrieveUnlimitedGame = (
  state: RootState["unlimited"],
  isAtp: boolean
): UnlimitedGame => {
  return state[isAtp ? "atpGame" : "wtaGame"];
};
