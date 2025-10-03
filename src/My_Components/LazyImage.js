import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

/**
 * LazyImage - A component for lazy loading images with blur effect
 * 
 * @param {string} src - The source URL of the image
 * @param {string} alt - Alternative text for the image
 * @param {object} style - Custom styles to apply to the image
 * @param {string} className - CSS class names to apply to the image
 * @param {function} onClick - Click handler for the image
 * @param {object} props - Additional props to pass to the LazyLoadImage component
 */
const LazyImage = ({ src, alt, style, className, onClick, ...props }) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt || 'Image'}
      effect="blur"
      style={style}
      className={className}
      onClick={onClick}
      threshold={100}
      placeholderSrc={`data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMmUyZTIiLz48L3N2Zz4=`}
      {...props}
    />
  );
};

export default LazyImage;