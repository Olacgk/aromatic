"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

export default function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}
