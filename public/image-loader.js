// Simple image optimization middleware
// This script can be included in index.html to preload critical images
document.addEventListener('DOMContentLoaded', function() {
  // Preload critical images
  const criticalImages = [
    '/Images/Logo1.png',
    '/Images/2-Cars.png'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
  
  // Add support for native lazy loading where available
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.loading = 'lazy';
    });
  }
});