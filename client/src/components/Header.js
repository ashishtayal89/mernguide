import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import features from "./appFeatures";

export default function Header() {
  const [activeRoute, setActiveRoute] = useState(window.location.pathname);
  return (
    <div className="header">
      {features
        .filter(({ label }) => label)
        .map(({ route, label }) => (
          <Link
            key={route}
            to={route}
            className={activeRoute === route ? "active" : ""}
            onClick={() => setActiveRoute(route)}
          >
            {label}
          </Link>
        ))}
    </div>
  );
}
