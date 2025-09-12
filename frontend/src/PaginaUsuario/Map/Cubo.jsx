import React, { useState } from 'react';
import styles from './Cubo.module.css';

const Cubo = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const startDrag = (e) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const onDrag = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;

    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));

    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  const transformStyle = {
    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    transformStyle: 'preserve-3d',
    width: '100px',
    height: '100px',
    position: 'relative',
    margin: '100px auto',
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div 
      className={styles.cubeContainer}
      onMouseDown={startDrag}
      onMouseMove={onDrag}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      style={transformStyle}
    >
      <div className={`${styles.face} ${styles.front}`}></div>
      <div className={`${styles.face} ${styles.back}`}></div>
      <div className={`${styles.face} ${styles.right}`}></div>
      <div className={`${styles.face} ${styles.left}`}></div>
      <div className={`${styles.face} ${styles.top}`}></div>
      <div className={`${styles.face} ${styles.bottom}`}></div>
    </div>
  );
};

export default Cubo;