"use client";

import React from "react";
import { useTheme } from "next-themes";
import { IoSunny } from "react-icons/io5";
import { FaRobot } from "react-icons/fa6";
import { IoMoon } from "react-icons/io5";
import Button from "./button";


const Darkmode = ({name}) => {
  const { theme, setTheme } = useTheme("light");

  return (
    <Button
      className={name ? "flex justify-between py-2 px-3 text-lg sm:text-sm" : "text-sm p-1 md:p-[6px]  rounded-lg"}
      variant={name ? 'darkMode' : 'home'}
      onClick={() => {
        setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" :theme === "system" ? "light" : "system");
      }}
      type="button"
    >
      {/* {theme === "light" ? <IoSunny /> : <FaMoon />} */}
      {name && <span>{theme === "light" ? "روشن"  : theme === "dark" ? "تاريک" :theme === "system" ? "سيستم" : "روشن"}</span>}
      {theme === "light" ? <IoSunny className="text-xl my-auto sm:text-lg"/>  : theme === "dark" ? <IoMoon className="text-xl my-auto sm:text-lg"/> :theme === "system" ? <FaRobot className="text-xl my-auto sm:text-lg"/> : <IoSunny className="text-xl my-auto sm:text-lg"/>}
    </Button>
  );
};

export default Darkmode;