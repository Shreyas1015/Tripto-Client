import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { generatePlaceholder, generateSrcSet } from '../utils/imageUtils';

/**
 * ImageOptimizer - A utility component for optimizing images
 * 
 * This component provides various image optimization techniques:
 * 1. Lazy loading - Only loads images when they enter the viewport
 * 2. Blur effect - Shows a blurred placeholder while loading
 * 3. WebP support - Uses modern image formats when supported
 * 4. Responsive sizing - Automatically adjusts image size based on viewport
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alternative text for accessibility
 * @param {Object} props.sizes - Responsive size configuration
 * @param {string} props.className - CSS classes
 * @param {Object} props.style - Inline styles
 * @param {Function} props.onLoad - Callback when image loads
 * @param {Function} props.onClick - Click handler
 */
const ImageOptimizer = ({
  src,
  alt = 'Image',
  sizes,
  className,
  style,
  onLoad,
  onClick,
  ...rest
}) => {
  // Generate placeholder and srcSet for responsive images
  const placeholderSrc = generatePlaceholder();
  const srcSetValue = sizes ? generateSrcSet(src) : undefined;

  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      effect="blur"
      placeholderSrc={placeholderSrc}
      srcSet={srcSetValue}
      threshold={200}
      className={className}
      style={style}
      onLoad={onLoad}
      onClick={onClick}
      loading="lazy"
      decoding="async"
      {...rest}
    />
  );
};

export default ImageOptimizer;