import { useEffect, useState } from 'react';

export const useViewportHeight = () => {
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01;
      setViewportHeight(window.innerHeight);
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    // Para iOS Safari
    window.addEventListener('scroll', updateHeight, { passive: true });

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
      window.removeEventListener('scroll', updateHeight);
    };
  }, []);

  return viewportHeight;
};
