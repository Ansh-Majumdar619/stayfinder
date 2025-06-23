/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const ChromaGrid = ({
  images = [],
  title,
  subtitle,
  handle,
  borderColor,
  gradient,
  onClick,
}) => {
  const cardRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVertical, setIsVertical] = useState(false);
  const intervalRef = useRef(null);

  const handleCardMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const resetRotation = () => {
    const card = cardRef.current;
    if (card) card.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  const startSlideshow = () => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
  };

  const stopSlideshow = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setCurrentIndex(0); // Optional: reset to first image
  };

  // Detect image orientation
  useEffect(() => {
    const img = new Image();
    img.src = images[currentIndex];
    img.onload = () => {
      setIsVertical(img.height > img.width);
    };
  }, [images, currentIndex]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current); // Cleanup
  }, []);

  return (
    <motion.article
      whileHover={{ scale: 1.03 }}
      onMouseEnter={startSlideshow}
      onMouseLeave={() => {
        stopSlideshow();
        resetRotation();
      }}
      onMouseMove={handleCardMove}
      onClick={onClick}
      ref={cardRef}
      className="group relative flex flex-col w-full max-w-sm sm:max-w-[320px] md:max-w-[300px] rounded-[20px] overflow-hidden border-2 border-transparent transition-all duration-300 cursor-pointer"
      style={{
        "--card-border": borderColor || "transparent",
        background: gradient || "linear-gradient(145deg, #4F46E5, #000)",
        "--spotlight-color": "rgba(255,255,255,0.3)",
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease-out",
      }}
    >
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--spotlight-color), transparent 70%)",
        }}
      />

      {/* Image Section with fixed aspect ratio */}
      <div className="relative z-10 bg-black rounded-[10px] aspect-[4/3] flex items-center justify-center overflow-hidden m-2">
        <img
          src={images[currentIndex]}
          alt={title}
          loading="lazy"
          className={`w-full h-full rounded-[10px] transition duration-500 ease-in-out ${isVertical ? "object-contain" : "object-cover"}`}
        />
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-3 text-white font-sans grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
        <h3 className="m-0 text-[1.05rem] font-semibold">{title}</h3>
        {handle && (
          <span className="text-[0.95rem] opacity-80 text-right">{handle}</span>
        )}
        <p className="m-0 text-[0.85rem] opacity-85 col-span-2">{subtitle}</p>
      </footer>
    </motion.article>
  );
};

export default ChromaGrid;
