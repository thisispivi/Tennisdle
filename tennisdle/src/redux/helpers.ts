import { computed,inject } from "vue";

import { storeKey } from "./create";
import { RootState,store } from "./store";

export const useDispatch = () => store.dispatch;

export const useSelector = <State extends RootState = RootState>(
  fn: (state: State) => State[keyof State]
) => {
  const rootStore = inject(storeKey) as { state: RootState };
  return computed(() => fn(rootStore.state as State));
};
