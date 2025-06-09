import React, { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa6';

const Accordion = ({ title, children,menuStyle,btnStyle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='w-full '>
      <button
        className={`flex ${btnStyle} justify-between items-center w-full px-2 py-4 focus:outline-none  gap-3  text-right `}
        type='button'
        onClick={toggleAccordion}
      >
        <span>{title}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'} `}>
           <FaCaretDown/>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className={` ${menuStyle}  `}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
