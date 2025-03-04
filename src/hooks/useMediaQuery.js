import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if a media query matches
 * @param {string} query - The CSS media query to check
 * @returns {boolean} Whether the media query matches
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Create event listener for changes
    const handleResize = (event) => {
      setMatches(event.matches);
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleResize);
      
      // Cleanup
      return () => {
        mediaQuery.removeEventListener('change', handleResize);
      };
    } 
    // Legacy support for Safari < 14, IE, and older browsers
    else {
      mediaQuery.addListener(handleResize);
      
      // Cleanup
      return () => {
        mediaQuery.removeListener(handleResize);
      };
    }
  }, [query]);

  return matches;
};

// Predefined breakpoints that match Tailwind's defaults
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

export default useMediaQuery;