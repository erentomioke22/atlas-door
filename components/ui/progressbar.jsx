// components/ProgressBar.js

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
