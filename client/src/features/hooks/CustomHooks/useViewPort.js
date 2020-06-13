import React, { useMemo, useState, useEffect } from "react";
import { VIEWPORTS } from "../../../constants/viewPorts";

const createMediaQuery = config => {
  const mediaQueryList = [];
  for (let key in config) {
    switch (key) {
      case "max":
      case "min":
        mediaQueryList.push(`(${key}-width: ${config[key]}px)`);
        break;
      default:
        break;
    }
  }
  const mediaQueryString = mediaQueryList.join(" and ");
  return window.matchMedia(mediaQueryString);
};

const createMediaQueries = configList => configList.map(createMediaQuery);

const useViewPort = () => {
  const mediaQueries = useMemo(() => createMediaQueries(VIEWPORTS), [
    VIEWPORTS
  ]);
  const getViewPortsStatus = () =>
    mediaQueries.map(mediaQuery => mediaQuery.matches);
  const [viewPortsStatus, setViewPortsStatus] = useState(getViewPortsStatus);
  useEffect(() => {
    const handler = () => setViewPortsStatus(getViewPortsStatus);
    mediaQueries.forEach(mediaQuery => mediaQuery.addListener(handler));
    return () =>
      mediaQueries.forEach(mediaQuery => mediaQuery.addListener(handler));
  }, []);
  return VIEWPORTS.find((_viewPort, index) => viewPortsStatus[index]);
};

export const UseViewPort = () => {
  const viewPort = useViewPort();
  return (
    <>
      <div>VIEWPORTS : {viewPort.name}</div>
      <div>Max Width : {viewPort.max}</div>
      <div>Min Width : {viewPort.min}</div>
    </>
  );
};
