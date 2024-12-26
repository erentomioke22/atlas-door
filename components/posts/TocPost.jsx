import { useEffect, useRef, useState } from "react";

export const TOC = ({ selector, items }) => {
  const [currentHeadingID, setCurrentHeadingID] = useState(null);
  const listWrapperRef = useRef(null);

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          setCurrentHeadingID(entry.target.getAttribute("data-toc-id"));
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "0% 0% -60% 0%",
      threshold: [0.1, 0.5, 1.0],
    });

    const elements = document.querySelectorAll(`${selector} [data-toc-id]`);
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [items, selector]);

  const handleClick = (id) => {
    const element = document.querySelector(`[data-toc-id='${id}']`);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 60,
        behavior: "smooth",
      });
      setCurrentHeadingID(id);
    }
  };

  return (
    <div className="sticky top-10  py-2 ">
      <p>فهرست مطالب</p>
      <div className="p-1 h-full  space-y-3 text-sm " ref={listWrapperRef}>
        {items.map((item,index) => (
          <button
            key={index}
            style={{ paddingRight: `${item.originalLevel * 10}px` }}
            className={`w-full  rounded-md font-semibold duration-300  text-wrap line-clamp-2 text-start ${
              currentHeadingID === item.link
                ? "underline decoration-2 text-black dark:text-white"
                : "hover:text-black dark:hover:text-white text-lfont"
            }`}
            title={item.textContent}
            onClick={() => handleClick(item.link)}
          >
            {item.textContent}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TOC;




