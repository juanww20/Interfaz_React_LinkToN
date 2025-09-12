import React, { useState, useEffect } from 'react';
import styles from './LoaderAnimation.module.css';
import ComponenteTangram from './ComponenteTangram';

const LoaderAnimation = () => {
  // showLoader: extract boolean value from localStorage ('true' or 'false'), default true
  const [showLoader, setShowLoader] = useState(localStorage.getItem('showLoader') === 'false' ? false : true);
  
  useEffect(() => {
    // Loader timeout from localStorage (in ms), default 6000
    const tiempo = Number(localStorage.getItem('loaderTime')) || 6000;
    
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, tiempo);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount

  if (!showLoader) return null;

  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.tangramLoader}>
        <ComponenteTangram />
      </div>
    </div>
  );
};

export default LoaderAnimation;