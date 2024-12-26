import React, { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa6';

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='w-full '>
      <button
        className="flex  justify-between items-center w-full p-4 focus:outline-none text-lg sm:text-xl space-x-3 lg:text-2xl text-right"
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
        <div className="p-4 text-lfont text-sm ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
