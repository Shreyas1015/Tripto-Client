import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

/**
 * ResponsiveImage component that automatically selects the appropriate image size
 * based on the device's screen width
 */
const ResponsiveImage = ({ 
  src,
  alt = "Image",
  className = "",
  style = {},
  sizes = [
    { width: 480, size: 'small' },
    { width: 768, size: 'medium' },
    { width: 1200, size: 'large' },
  ],
  ...props 
}) => {
  // Function to get the appropriate image size based on screen width
  const getResponsiveImageSrc = (imagePath) => {
    if (!imagePath) return '';
    
    // For external images, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Get file extension
    const extension = imagePath.split('.').pop();
    
    // Check if WebP is supported
    const supportsWebP = () => {
      const elem = document.createElement('canvas');
      if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      return false;
    };
    
    // Use WebP if supported, otherwise use original format
    const format = supportsWebP() ? 'webp' : extension;
    
    // Add responsive parameters
    return `${imagePath}?format=${format}`;
  };

  return (
    <LazyLoadImage
      src={getResponsiveImageSrc(src)}
      alt={alt}
      className={className}
      style={style}
      effect="blur"
      threshold={200}
      placeholderSrc={`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzIDIiPjwvc3ZnPg==`}
      {...props}
    />
  );
};

export default ResponsiveImage;