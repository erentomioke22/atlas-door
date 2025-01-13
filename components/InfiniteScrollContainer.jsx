import { useEffect, useRef } from "react";

export default function InfiniteScrollContainer({ children, onBottomReached, className }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    const currentBottomRef = bottomRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onBottomReached();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    if (currentBottomRef) {
      observer.observe(currentBottomRef);
    }

    return () => {
      if (currentBottomRef) {
        observer.unobserve(currentBottomRef);
      }
    };
  }, [onBottomReached]);

  return (
    <div className={className}>
      {children}
      <div ref={bottomRef} />
    </div>
  );
}
