import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function PageTransition({ children }) {
  const location = useLocation();
  const [showContent, setShowContent] = useState(true);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Fade out current page
      setShowContent(false);

      // After fade-out, swap content and fade in
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setShowContent(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}

export default PageTransition;
