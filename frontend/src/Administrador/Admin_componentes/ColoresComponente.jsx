import React, { useState, useEffect } from 'react';
import styles from '../Admin.module.css';

const ColoresComponente = () => {
  // Estilos por defecto
  const defaultStyles = {
    color_one: '#092db0',
    color_two: '#4B97F5',
    color_three: '#AED6F5',
    color_four: '#0D0D2E',
    color_five: '#FFFFFF',
  };

  const [headerBgColor, setHeaderBgColor] = useState(defaultStyles.color_one);
  const [titleColor, setTitleColor] = useState(defaultStyles.color_two);
  const [divBorderColor, setDivBorderColor] = useState(defaultStyles.color_three);
  const [cardBgColor, setCardBgColor] = useState(defaultStyles.color_four);
  const [footerBgColor, setFooterBgColor] = useState(defaultStyles.color_five);
  const [titleFontSize] = useState(32);
  
  // Datos simulados de paletas guardadas (solo para diseño)
  const [savedStylesColor, setSavedStylesColor] = useState([
    {
      id: 1,
      name: "Paleta: 1",
      colors: {
        color_one: '#092db0',
        color_two: '#4B97F5',
        color_three: '#AED6F5',
        color_four: '#0D0D2E',
        color_five: '#FFFFFF',
        colors_id: 1
      }
    },
    {
      id: 2,
      name: "Paleta: 2",
      colors: {
        color_one: '#FF5733',
        color_two: '#33FF57',
        color_three: '#3357FF',
        color_four: '#F333FF',
        color_five: '#FFFF33',
        colors_id: 2
      }
    }
  ]);

  // Cargar colores del localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('activePalette');
    if (saved) {
      try {
        const palette = JSON.parse(saved);
        setHeaderBgColor(palette.colors.color_one || defaultStyles.color_one);
        setTitleColor(palette.colors.color_two || defaultStyles.color_two);
        setDivBorderColor(palette.colors.color_three || defaultStyles.color_three);
        setCardBgColor(palette.colors.color_four || defaultStyles.color_four);
        setFooterBgColor(palette.colors.color_five || defaultStyles.color_five);
      } catch (error) {
        console.error('Error parsing saved palette:', error);
      }
    }
  }, []);

  // Guardar colores en localStorage cuando cambien
  useEffect(() => {
    const palette = {
      colors: {
        color_one: headerBgColor,
        color_two: titleColor,
        color_three: divBorderColor,
        color_four: cardBgColor,
        color_five: footerBgColor
      }
    };
    localStorage.setItem('activePalette', JSON.stringify(palette));
  }, [headerBgColor, titleColor, divBorderColor, cardBgColor, footerBgColor]);

  const resetStyles = () => {
    setHeaderBgColor(defaultStyles.color_one);
    setTitleColor(defaultStyles.color_two);
    setDivBorderColor(defaultStyles.color_three);
    setCardBgColor(defaultStyles.color_four);
    setFooterBgColor(defaultStyles.color_five);
    
    alert('¡Estilos restablecidos!');
  };

  // Función simulada para aplicar paleta (solo muestra un mensaje)
  const applyColorPalette = (palette) => {
    alert(`Aplicando paleta: ${palette.name}`);
  };

  // Función simulada para editar (solo muestra un mensaje)
  const handleEdit = (palette) => {
    alert(`Editando paleta: ${palette.name}`);
  };

  // Función simulada para eliminar (solo muestra un mensaje)
  const handleDeletePalette = (id) => {
    alert(`Eliminando paleta con ID: ${id}`);
  };

  return (
    <div className={`${styles.row} ${styles.colorsection}`}>
      <div className={styles.controlPanel}>
        <div className={styles.controlGroup}>
          <h2>🎨 Colores</h2>
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="primary_color">Color Primario:</label>
          <input 
            type="color" 
            id="primary_color" 
            value={headerBgColor} 
            onChange={(e) => setHeaderBgColor(e.target.value)} 
          />
          <span className={styles.colorHex}>{headerBgColor}</span>
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="secondary_color">Color Secundario:</label>
          <input 
            type="color" 
            id="secondary_color" 
            value={titleColor} 
            onChange={(e) => setTitleColor(e.target.value)} 
          />
          <span className={styles.colorHex}>{titleColor}</span>
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="tertiary_color">Color Terciario:</label>
          <input 
            type="color" 
            id="tertiary_color" 
            value={divBorderColor} 
            onChange={(e) => setDivBorderColor(e.target.value)} 
          />
          <span className={styles.colorHex}>{divBorderColor}</span>
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="light_color">Color Neutro 1:</label>
          <input 
            type="color" 
            id="light_color" 
            value={cardBgColor} 
            onChange={(e) => setCardBgColor(e.target.value)} 
          />
          <span className={styles.colorHex}>{cardBgColor}</span>
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="dark_color">Color Neutro 2:</label>
          <input 
            type="color" 
            id="dark_color" 
            value={footerBgColor} 
            onChange={(e) => setFooterBgColor(e.target.value)} 
          />
          <span className={styles.colorHex}>{footerBgColor}</span>
        </div>

        <div className={styles.savesection}>
          <button className={styles.saveBtn} onClick={resetStyles}>Restablecer paleta</button>
        </div>
      </div>
      
      <div>
        <div className={styles.row}>
          <fieldset className={styles.controlPanel}>
            <div className={styles.savedstyles}>
              <h3>Estilos guardados</h3>
              <div id="savedStylesList" className={styles.customScrollbar}>
                {savedStylesColor.map(palette => (
                  <div key={palette.id} className={styles.savedStyleItem}>
                    <span>{palette.name}</span>
                    <div className={styles.colorPreview}>
                      {[palette.colors.color_one, palette.colors.color_two, palette.colors.color_three, palette.colors.color_four, palette.colors.color_five].map((color, idx) => (
                        <div 
                          key={idx} 
                          className={styles.colorBox} 
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                    <div className={styles.styleActions}>
                      <button onClick={() => applyColorPalette(palette)}>✅ Aplicar</button>
                      <button onClick={() => handleEdit(palette)}>✏️ Editar</button>
                      <button onClick={() => handleDeletePalette(palette.colors.colors_id)}>🗑️ Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      <div className={styles.playground}>
        <header style={{ backgroundColor: headerBgColor }} id="playground-header">
          <h1 style={{ color: titleColor, fontSize: `${titleFontSize}px` }} id="mainTitle">Título</h1>
        </header>

        <div style={{ borderColor: divBorderColor }} className={styles.divWithBorder}>
          Hola Mundo
        </div>

        <div className={styles.card} style={{ backgroundColor: cardBgColor }}>
          <h2>Título de Carta</h2>
          <p className={styles.content}>Hola, aquí donde hace las pruebas para cambio de letras.</p>
        </div>

        <footer id="playground-footer" style={{ backgroundColor: footerBgColor }}>
          <p>Footer © MJS</p>
        </footer>
      </div>
    </div>
  );
};

export default ColoresComponente;