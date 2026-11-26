"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ProductImage from "./ProductImage";

export default function Gallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const list = images.length ? images : [""];

  return (
    <div>
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden bg-card"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              transform: zoom.on ? "scale(1.8)" : "scale(1)",
              transformOrigin: `${zoom.x}% ${zoom.y}%`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <ProductImage src={list[i]} name={name} sizes="(min-width: 768px) 50vw, 100vw" priority />
          </motion.div>
        </AnimatePresence>
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-3">
          {list.map((src, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              className={`relative h-20 w-20 overflow-hidden border transition ${n === i ? "border-gold" : "border-line opacity-60 hover:opacity-100"}`}
            >
              <ProductImage src={src} name={name} sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
