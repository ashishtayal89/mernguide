import * as UseState from "../features/hooks/UseState";
import * as UseEffect from "../features/hooks/UseEffect";
import * as UseMemo_UseCallback from "../features/hooks/UseMemo-UseCallback";
import * as CustomHooks from "../features/hooks/CustomHooks";
import moduleIterator from "../utils/moduleIterator";

const features = [
  {
    route: "/",
    component: () => "Tutorial to learn react hooks"
  },
  {
    label: "Use State",
    route: "/hooks/useState",
    component: moduleIterator(UseState)
  },
  {
    label: "Use Effect",
    route: "/hooks/useEffect",
    component: moduleIterator(UseEffect)
  },
  {
    label: "Use Memo/Callback",
    route: "/hooks/useMemo_useCallback",
    component: moduleIterator(UseMemo_UseCallback)
  },
  {
    label: "Custom hooks",
    route: "/hooks/customHooks",
    component: moduleIterator(CustomHooks)
  }
];

export default features;
