import { inject, computed } from "vue";
import { store, RootState } from "./store";
import { storeKey } from "./create";

export const useDispatch = () => store.dispatch;

export const useSelector = <State extends RootState = RootState>(
  fn: (state: State) => State[keyof State]
) => {
  const rootStore = inject(storeKey) as { state: RootState };
  return computed(() => fn(rootStore.state as State));
};
