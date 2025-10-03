/**
 * Image Optimization Utilities
 * 
 * This file contains utility functions for image optimization across the application.
 */

/**
 * Generates a responsive srcSet for images
 * @param {string} baseUrl - The base URL of the image
 * @param {Array} widths - Array of widths to generate srcSet for
 * @returns {string} - The srcSet string
 */
export const generateSrcSet = (baseUrl, widths = [320, 640, 960, 1280]) => {
  if (!baseUrl) return '';
  
  // For external URLs or URLs that already have query parameters, we can't modify them
  if (baseUrl.startsWith('http') || baseUrl.includes('?')) {
    return baseUrl;
  }
  
  // For local images in the public folder
  return widths.map(width => `${baseUrl}?w=${width} ${width}w`).join(', ');
};

/**
 * Generates a simple SVG placeholder for images
 * @param {number} width - Width of the placeholder
 * @param {number} height - Height of the placeholder
 * @param {string} color - Background color of the placeholder
 * @returns {string} - Base64 encoded SVG
 */
export const generatePlaceholder = (width = 100, height = 100, color = '#e2e2e2') => {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Determines if WebP format is supported by the browser
 * @returns {boolean} - Whether WebP is supported
 */
export const supportsWebP = () => {
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Gets the optimal image format based on browser support
 * @param {string} url - Original image URL
 * @returns {string} - URL with optimal format
 */
export const getOptimalImageFormat = (url) => {
  if (!url) return '';
  
  // If WebP is supported and the URL doesn't already specify a format
  if (supportsWebP() && !url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return `${url}.webp`;
  }
  
  return url;
};