'use client';

import { ReactNode, useEffect, useRef } from "react";

interface InfiniteScrollContainerProps {
  children: ReactNode;
  onBottomReached: () => void;
  className?: string;
}

export default function InfiniteScrollContainer({ children, onBottomReached, className }: InfiniteScrollContainerProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentBottomRef = bottomRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onBottomReached();
      },
      { rootMargin: "200px" }
    );

    if (currentBottomRef) observer.observe(currentBottomRef);

    return () => {
      if (currentBottomRef) observer.unobserve(currentBottomRef);
    };
  }, [onBottomReached]);

  return (
    <div className={className}>
      {children}
      <div ref={bottomRef} />
    </div>
  );
}