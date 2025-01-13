"use client";

import React from "react";
import { useTheme } from "next-themes";
import { IoSunny } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";

const Darkmode = () => {
  const { theme, setTheme } = useTheme("light");

  return (
    <button
      className=" bg-lcard hover:bg-lbtn rounded-full px-3 py-1 duration-500 dark:bg-dcard dark:hover:bg-dbtn  border-lbtn border dark:border-dbtn"
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}
    >
      {theme === "light" ? <IoSunny /> : <FaMoon />}
    </button>
  );
};

export default Darkmode;
