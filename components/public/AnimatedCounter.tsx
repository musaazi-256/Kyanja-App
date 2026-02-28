"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  end: number;
  suffix?: string;
  duration?: number;
}

export default function AnimatedCounter({ end, suffix = "", duration = 2000 }: Props) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime: number | null = null;
          const startValue = 0;
          
          const animation = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const progress = currentTime - startTime;
            const progressRatio = Math.min(progress / duration, 1);
            
            // easeOutQuart easing for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progressRatio, 4);
            const currentCount = Math.floor(easeOut * (end - startValue) + startValue);
            
            setCount(currentCount);
            
            if (progress < duration) {
              requestAnimationFrame(animation);
            } else {
              setCount(end);
            }
          };
          
          requestAnimationFrame(animation);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={countRef}>
      {count}
      {suffix}
    </span>
  );
}
