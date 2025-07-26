import { useEffect, useState } from 'react';

const ProgressBar = () => {
    const [scrollPercentage, setScrollPercentage] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (scrollTop / windowHeight) * 100;

            setScrollPercentage(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`h-1 //${scrollPercentage > 98 ? '--bg-black':''} bg-black dark:bg-white  fixed top-0 left-0 w-full z-[9999999999]`} style={{ width: `${scrollPercentage}%` }} />
    );
};

export default ProgressBar;


{/* <div className="relative text-lbtn dark:text-[#a6adbb]">
<div className="w-5 h-5 md:w-6 md:h-6">
  <div className="absolute top-0 left-0 w-full h-full">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle
        strokeWidth="18"
        stroke="currentColor"
        fill="transparent"
        r="40"
        cx="50"
        cy="50"
      />
      <circle
        className={` ${progress >= 95 ? "text-darkgreen" : "text-black dark:text-white"} rounded-xl stroke-current transition-all duration-300 ease-out`}
        strokeWidth="21"
        strokeDasharray="251.2"
        strokeDashoffset="251.2"
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r="40"
        cx="50"
        cy="50"
        style={{ strokeDashoffset: `calc(251.2 - (251.2 * ${progress}) / 100)` }}
      />
    </svg>
  </div>
</div>
  </div> */}