import React, { useLayoutEffect } from "react";

export function With_Sync_Effect() {
  useLayoutEffect(() => {
    alert("Stop screen update");
  });
  return <div>Rendered in Sync Effect</div>;
}
