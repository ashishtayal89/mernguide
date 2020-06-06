import * as CallbackRef from "./add_ref/callbackRef";
import * as CreateRef from "./add_ref/createRef";
import * as StringReg_Legacy from "./add_ref/stringReg_Legacy";
import * as UseRef from "./add_ref/useRef";
import * as ClassRef from "./types_of_ref/class";
import * as FunctionRef from "./types_of_ref/function";
import * as CreateRefForwarding from "./forward_ref/createRefForwarding";
import * as UseRefForwarding from "./forward_ref/useRefForwarding";
import * as CallbackRefForwarding from "./forward_ref/callbackForwarding";

export default [
  CreateRef,
  CallbackRef,
  StringReg_Legacy,
  UseRef,
  ClassRef,
  FunctionRef,
  CreateRefForwarding,
  UseRefForwarding,
  CallbackRefForwarding
];
