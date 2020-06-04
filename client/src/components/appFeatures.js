import * as UseState from "../features/hooks/UseState";
import * as UseEffect from "../features/hooks/UseEffect";
import * as UseMemo_UseCallback from "../features/hooks/UseMemo-UseCallback";
import * as UseContext from "../features/hooks/UseContext";
import * as UseReducer from "../features/hooks/UseReducer";
import * as CustomHooks from "../features/hooks/CustomHooks";
import * as Context from "../features/context";
import * as Ref from "../features/ref";

import { moduleIterator, modulesIterator } from "../utils/moduleIterator";

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
    label: "Use Context",
    route: "/hooks/useContext",
    component: moduleIterator(UseContext)
  },
  {
    label: "Use Reducer",
    route: "/hooks/useReducer",
    component: moduleIterator(UseReducer)
  },
  {
    label: "Custom hooks",
    route: "/hooks/customHooks",
    component: modulesIterator(CustomHooks)
  },
  {
    label: "Context",
    route: "/context",
    component: modulesIterator(Context)
  },
  {
    label: "Ref",
    route: "/ref",
    component: modulesIterator(Ref)
  }
];

export default features;
