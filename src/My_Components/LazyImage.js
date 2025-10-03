import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

/**
 * LazyImage component for optimized image loading
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alternative text for the image
 * @param {string} className - CSS class names
 * @param {object} style - Inline styles
 * @param {string} effect - Loading effect (blur, opacity, black-and-white)
 * @param {function} onClick - Click handler
 * @param {object} props - Additional props
 */
const LazyImage = ({ 
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

export default LazyImage;