// import { useEffect, useRef, useState } from "react";

// export const TOC = ({ selector, items }) => {
//   const [currentHeadingID, setCurrentHeadingID] = useState(null);
//   const listWrapperRef = useRef(null);

//   useEffect(() => {
//     const handleIntersection = (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting && entry.intersectionRatio > 0) {
//           setCurrentHeadingID(entry.target.getAttribute("data-toc-id"));
//         }
//       });
//     };

//     const observer = new IntersectionObserver(handleIntersection, {
//       rootMargin: "0% 0% -60% 0%",
//       threshold: [0.1, 0.5, 1.0],
//     });

//     const elements = document.querySelectorAll(`${selector} [data-toc-id]`);
//     elements.forEach((el) => observer.observe(el));

//     return () => {
//       elements.forEach((el) => observer.unobserve(el));
//     };
//   }, [items, selector]);

//   const handleClick = (id) => {
//     const element = document.querySelector(`[data-toc-id='${id}']`);
//     if (element) {
//       window.scrollTo({
//         top: element.getBoundingClientRect().top + window.scrollY - 60,
//         behavior: "smooth",
//       });
//       setCurrentHeadingID(id);
//     }
//   };

//   return (
//     <div className="sticky top-10  py-2 ">
//       <p>فهرست مطالب</p>
//       <div className="p-1 h-full  space-y-3 text-sm " ref={listWrapperRef}>
//         {items.map((item,index) => (
//           <button
//             key={index}
//             style={{ paddingRight: `${item.originalLevel * 10}px` }}
//             className={`w-full  rounded-md font-semibold duration-300  text-wrap line-clamp-2 text-start ${
//               currentHeadingID === item.link
//                 ? "underline decoration-2 text-black dark:text-white"
//                 : "hover:text-black dark:hover:text-white text-lfont"
//             }`}
//             title={item.textContent}
//             onClick={() => handleClick(item.link)}
//           >
//             {item.textContent}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TOC;






import Offcanvas from '@components/ui/offcanvas';
import { useEffect, useState, useRef } from 'react';

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef(null);
  const [close, setClose] = useState(false);

  useEffect(() => {
    // if (content) {
      const content = document.querySelector('.content');
      const elements = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingList = Array.from(elements).map((element) => ({
        text: element.innerText,
        id: element.id,
        level: Number(element.tagName.replace('H', '')),
      }));
      setHeadings(headingList);

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const visibleHeadings = entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target.id);
          if (visibleHeadings.length > 0) {
            setActiveId(visibleHeadings[0]);
          }
        },
        { rootMargin: '0px 0px -95% 0px' }
      );

      observerRef.current = observer;

      elements.forEach((element) => observer.observe(element));

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    // }
  }, []);

  const handleClick = (id) => {
    const element = document.querySelector(`[id='${id}']`);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 120,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  return (
    <Offcanvas 
    title={activeId}
    btnStyle={'bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg'}
    position={"bottom-0 left-0"} size={"h-3/4 w-full border-t-2 border-lcard dark:border-dcard rounded-t-3xl"} openTransition={"translate-y-0"} closeTransition={"translate-y-full"} onClose={close}
    >
    <div className="py-2 max-h-80  md:max-h-128 overflow-y-scroll">
    <div className=" flex justify-between">
      <h1 className="text-xl">Comment</h1>
      <button
        className={" text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-lfont "}
        onClick={() => setClose(!close)}
        type="button"
              >
            <IoClose/>
      </button>
    </div>
     {headings && headings?.length >= 1 &&  <p>فهرست مطالب</p>}
      <div className="p-1 h-full space-y-3 text-sm">
        {headings.map((heading, index) => (
          <button
            key={index}
            style={{ paddingRight: `${heading.level * 10}px` }}
            className={`w-full rounded-md font-semibold duration-300 text-wrap line-clamp-2 text-start ${
              activeId === heading.id
                ? 'underline decoration-2 text-black dark:text-white'
                : 'hover:text-black dark:hover:text-white text-lfont'
            }`}
            title={heading.text}
            onClick={() => handleClick(heading.id)}
          >
            {heading.text}
          </button>
        ))}
      </div>
    </div>
    </Offcanvas>
  );
};

export default TableOfContents;

