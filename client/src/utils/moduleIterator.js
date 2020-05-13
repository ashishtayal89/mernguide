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
            {keys.map(key => (
              <li key={key} className="tab col s2">
                <a
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
  // return Object.keys(module).map((key, index) => {
  //   const Component = module[key];
  //   if (typeof Component === "function") {
  //     return (
  //       <>
  //         <div className="moduleExample">
  //           <Component key={index} />
  //         </div>
  //         <div className="row">
  //           <div className="col s12">
  //             <ul className="tabs">
  //               <li className="tab col s3">
  //                 <a href="#test1">Test 1</a>
  //               </li>
  //               <li className="tab col s3">
  //                 <a className="active" href="#test2">
  //                   Test 2
  //                 </a>
  //               </li>
  //             </ul>
  //           </div>
  // <div id="test1" className="col s12">
  //   Test 1
  // </div>
  //           <div id="test2" className="col s12">
  //             Test 2
  //           </div>
  //         </div>
  //       </>
  //     );
  //   }
  // });
};
export default moduleIterator;
