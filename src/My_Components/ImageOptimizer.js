import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

/**
 * ImageOptimizer - A utility component that automatically optimizes images
 * This component can be used as a drop-in replacement for all <LazyImage effect="blur" /> tags
 */
export const LazyImage = ({ 
  src, 
  alt = "Image", 
  className = "", 
  style = {}, 
  effect = "blur", 
  onClick,
  ...props 
}) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      className={className}
      style={style}
      effect={effect}
      onClick={onClick}
      threshold={200}
      placeholderSrc={`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzIDIiPjwvc3ZnPg==`}
      {...props}
    />
  );
};

/**
 * Optimizes image loading with proper sizing and formats
 * @param {string} imagePath - Path to the image
 * @param {number} width - Desired width (optional)
 * @param {string} format - Desired format (webp, jpeg, png)
 * @returns {string} - Optimized image path
 */
export const getOptimizedImagePath = (imagePath, width, format = 'webp') => {
  // Check if the image is from an external source
  if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    // For external images, we can't modify the path
    return imagePath;
  }

  // For local images, we can add width parameters
  // This assumes you have a server-side image processing solution
  // or are using a CDN that supports image transformations
  if (width && imagePath) {
    return `${imagePath}?w=${width}&format=${format}`;
  }

  return imagePath;
};

export default LazyImage;