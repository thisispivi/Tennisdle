import { RootState } from "../../../redux/store";
import { UnlimitedGame } from "../../../typings/UnlimitedGame";

export const retrieveUnlimitedGame = (
  state: RootState["unlimited"],
  isAtp: boolean
): UnlimitedGame => {
  return state[isAtp ? "atpGame" : "wtaGame"];
};
