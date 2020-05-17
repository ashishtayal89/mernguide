import React, { useState } from "react";

const moduleIterator = module => () => {
  const [moduleName, setModuleName] = useState(Object.keys(module)[0]);
  const keys = Object.keys(module);
  const Component = module[moduleName];
  return (
    <>
      <div className="row">
        <div className="col s12">
          <ul className="tabs">
            {keys
              .filter(key => !key.includes("Skip_"))
              .map(key => (
                <li key={key} className="tab col s2">
                  <a
                    title={key}
                    className={moduleName === key ? "active" : ""}
                    onClick={() => {
                      setModuleName(key);
                    }}
                  >
                    {key}
                  </a>
                </li>
              ))}
          </ul>
          <div id={moduleName} className="col s12 moduleExample">
            <Component />
          </div>
        </div>
      </div>
    </>
  );
};
export default moduleIterator;
