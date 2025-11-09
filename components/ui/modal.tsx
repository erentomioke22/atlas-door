"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Button from "./button";

type ModalProps = {
  children?: React.ReactNode;
  title?: React.ReactNode;
  header?: React.ReactNode;
  headerStyle?: string;
  btnStyle?: string;
  onClose?: unknown;
};

const Modal: React.FC<ModalProps> = ({
  children,
  title,
  header,
  headerStyle,
  btnStyle,
  onClose,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [onClose]);

  return (
    <>
      <button type="button" className={btnStyle} onClick={() => setOpen(!open)}>
        {title}
      </button>

      <div
        className={`fixed inset-0 h-screen transition-opacity  duration-300 ease-in-out z-99999 ${
          open
            ? "backdrop-blur-sm  opacity-100 "
            : "pointer-events-none invisible backdrop-blur-0 opacity-0 "
        }`}
      >
        <div className="fixed inset-0 " onClick={() => setOpen(false)}></div>
        <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0 z-10 ">
          <div className=".offcanvas relative space-y-5 transform max-h-128 overflow-auto  w-full  p-3 rounded-3xl bg-linear-to-tr from-lcard to-lbtn dark:from-dcard dark:to-dbtn dark:bg-black text-left shadow-xl transition-all  sm:w-full sm:max-w-lg my-10">
            <div className="bg-white p-4 dark:bg-black  rounded-3xl">
              <div className="flex justify-between my-5">
                <div>
                  <h1 className={`${headerStyle} `}>{header}</h1>
                </div>

                <div>
                  <Button type="button" onClick={() => setOpen(!open)}>
                    <IoClose />
                  </Button>
                </div>
              </div>

              <div>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
