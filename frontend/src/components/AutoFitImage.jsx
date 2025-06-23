import React, { useState, useEffect } from "react";

const AutoFitImage = ({ src, alt }) => {
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsVertical(img.naturalHeight > img.naturalWidth);
    };
  }, [src]);

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full ${isVertical ? "object-contain" : "object-cover"} object-center transition-all`}
      loading="lazy"
    />
  );
};

export default AutoFitImage;
