"use client"
import React, { useState } from 'react';
import Image from 'next/image';

const ZoomableImage = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  
  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    if (!showMagnifier) return;

    // Get relative cursor position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  const handleClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-50">
      <div 
        className="relative w-full h-full cursor-zoom-in"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-200"
          priority
        />
        
        {showMagnifier && !isZoomed && (
          <div 
            className="absolute pointer-events-none bg-white rounded-lg shadow-lg overflow-hidden"
            style={{
              width: '150px',
              height: '150px',
              top: `${Math.min(Math.max(0, position.y - 10), 80)}%`,
              left: `${Math.min(Math.max(0, position.x - 10), 80)}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              opacity: 0.9,
            }}
          >
            <div
              className="absolute w-[400%] h-[400%]"
              style={{
                transform: `translate(-${position.x}%, -${position.y}%)`,
              }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}
      </div>

      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 cursor-zoom-out flex items-center justify-center"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative w-[90vw] h-[90vh]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoomableImage;