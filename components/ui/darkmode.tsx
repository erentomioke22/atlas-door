"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { IoSunny, IoMoon } from "react-icons/io5";
import { FaRobot } from "react-icons/fa6";
import Button from "./button";

type DarkmodeProps = {
  name?: boolean;
};

const Darkmode: React.FC<DarkmodeProps> = ({ name }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        className={
          name
            ? "flex justify-between py-2 px-3 text-lg sm:text-sm"
            : "text-lg p-[5px] sm:p-[6px] rounded-lg"
        }
        variant={name ? "darkMode" : "home"}
        type="button"
        title="darkmode button"
      >
        {name && <span>سيستم</span>}
        <div className="text-xl my-auto sm:text-lg w-5 h-5" />{" "}
        {/* Placeholder */}
      </Button>
    );
  }

  return (
    <Button
      className={
        name
          ? "flex justify-between py-2 px-3 text-lg sm:text-sm"
          : "text-lg p-[5px] sm:p-[6px] rounded-lg"
      }
      variant={name ? "darkMode" : "home"}
      onClick={() => {
        setTheme(
          theme === "light"
            ? "dark"
            : theme === "dark"
            ? "system"
            : theme === "system"
            ? "light"
            : "system"
        );
      }}
      type="button"
      title="darkmode button"
    >
      {name && (
        <span>
          {theme === "light"
            ? "روشن"
            : theme === "dark"
            ? "تاريک"
            : theme === "system"
            ? "سيستم"
            : "روشن"}
        </span>
      )}
      {theme === "light" ? (
        <IoSunny className="text-xl my-auto sm:text-lg" />
      ) : theme === "dark" ? (
        <IoMoon className="text-xl my-auto sm:text-lg" />
      ) : theme === "system" ? (
        <FaRobot className="text-xl my-auto sm:text-lg" />
      ) : (
        <IoSunny className="text-xl my-auto sm:text-lg" />
      )}
    </Button>
  );
};

export default Darkmode;
