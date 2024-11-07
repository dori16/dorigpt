import { useEffect, useRef } from "react";

export function useScrollToBottom<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [containerRef, endRef]);

  return [containerRef, endRef] as const;
} 