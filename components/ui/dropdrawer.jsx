// components/Navbar.js
"use client";

import React from "react";
import { useState,useEffect, useRef } from "react";
import Dropdown from "./dropdown";
import Drawer from "./drawer";

const DropDrawer = ({children,title,btnStyle,className,onClose,disabled}) => {



  return (
    <div>
      <div className="hidden sm:block">
    <Dropdown
      title={title}
      close={onClose}
      className={className}
      disabled={disabled}
      btnStyle={btnStyle}
    >
      {children}
    </Dropdown>
      </div>
      
      
      <div className="block sm:hidden">
    <Drawer
      title={title}
      close={onClose}
      position={"bottom-0 left-0"} size={"h-3/4 w-full border-t-2 border-lcard dark:border-dcard rounded-t-3xl"} openTransition={"translate-y-0"} closeTransition={"translate-y-full"}
      disabled={disabled}
      btnStyle={btnStyle}
    >
        <div className="w-12 h-1.5 bg-lbtn rounded-full mx-auto my-2 " />
       {children}
    </Drawer>
      </div>
    </div>
  );
};

export default DropDrawer;