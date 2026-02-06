import React from "react";
import { NavLink } from "react-router";
import logo from "../../assets/logo.png";

const Logo = () => {
  return (
    <div className="flex items-center">
      <NavLink to={"/"} className="normal-case text-xl hidden lg:flex">
        <img src={logo} alt="AssetVerse Logo" className="w-10 h-10 mr-2" />
      </NavLink>
      <NavLink to={"/"} className="md:text-xl md:font-bold text-primary">
        Asset-Verse
      </NavLink>
    </div>
  );
};

export default Logo;
