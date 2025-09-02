import React, { useState, useRef } from 'react';
import styles from './EditorFuente.module.css';

const TypographyEditor = () => {
  // Estados para tamaños de fuente
  const [titleSize, setTitleSize] = useState(32);
  const [subtitleSize, setSubtitleSize] = useState(24);
  const [textSize, setTextSize] = useState(16);
  
  // Estados para fuentes y URLs
  const [primaryFontName, setPrimaryFontName] = useState('');
  const [secondaryFontName, setSecondaryFontName] = useState('');
  const [primaryFontUrl, setPrimaryFontUrl] = useState('');
  const [secondaryFontUrl, setSecondaryFontUrl] = useState('');
  
  // Estado para errores
  const [fontError, setFontError] = useState({ primary: '', secondary: '' });
  
  // Referencias para inputs de archivo
  const primaryFontInputRef = useRef(null);
  const secondaryFontInputRef = useRef(null);
  
  // Datos simulados de configuraciones guardadas
  const [savedConfigs, setSavedConfigs] = useState([
    {
      font_id: 1,
      title: 36,
      sub_title: 28,
      paragraph: 18,
      fontFamily: {
        name_principal: "Roboto Bold",
        name_secundary: "Open Sans"
      },
    },{
      font_id: 2,
      title: 36,
      sub_title: 28,
      paragraph: 18,
      fontFamily: {
        name_principal: "Roboto Bold",
        name_secundary: "Open Sans"
      },
    }
  ]);

  // Manejar subida de archivos de fuente
  const handleFontUpload = (type, event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar que sea archivo TTF
    if (!file.name.toLowerCase().endsWith('.ttf')) {
      setFontError(prev => ({ ...prev, [type]: 'Solo se permiten archivos .ttf' }));
      return;
    }
    
    // Limpiar error
    setFontError(prev => ({ ...prev, [type]: '' }));
    
    // Crear URL para el archivo
    const fontUrl = URL.createObjectURL(file);
    
    if (type === 'primary') {
      setPrimaryFontName(file.name.replace('.ttf', ''));
      setPrimaryFontUrl(fontUrl);
      
      // Aplicar la fuente al documento
      addFontToDocument(file.name.replace('.ttf', ''), fontUrl);
    } else {
      setSecondaryFontName(file.name.replace('.ttf', ''));
      setSecondaryFontUrl(fontUrl);
      
      // Aplicar la fuente al documento
      addFontToDocument(file.name.replace('.ttf', ''), fontUrl);
    }
    
    alert(`Fuente ${type === 'primary' ? 'principal' : 'secundaria'} cargada: ${file.name}`);
  };

  // Función para agregar fuentes dinámicamente al documento
  const addFontToDocument = (fontName, fontUrl) => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${fontName}';
        src: url('${fontUrl}') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  };

  // Resetear todos los valores
  const resetAll = () => {
    setTitleSize(32);
    setSubtitleSize(24);
    setTextSize(16);
    setPrimaryFontName('');
    setSecondaryFontName('');
    setPrimaryFontUrl('');
    setSecondaryFontUrl('');
    setFontError({ primary: '', secondary: '' });
    
    alert('Valores restablecidos');
  };

  // Aplicar estilo de fuente (simulado)
  const applyFontStyle = (config) => {
    setTitleSize(config.title);
    setSubtitleSize(config.sub_title);
    setTextSize(config.paragraph);
    
    alert(`Configuración aplicada: ${config.font_id}`);
  };

  // Manejar edición (simulado)
  const handleEdit = (config) => {
    alert(`Editando configuración: ${config.font_id}`);
  };

  // Manejar eliminación (simulado)
  const handleDeleteFont = (id) => {
    alert(`Eliminando configuración: ${id}`);
    setSavedConfigs(prev => prev.filter(config => config.font_id !== id));
  };

  // Obtener estilos en línea para preview
  const getTitleStyle = () => ({
    fontSize: `${titleSize}px`,
    fontFamily: primaryFontName ? `'${primaryFontName}', sans-serif` : 'inherit'
  });

  const getSubtitleStyle = () => ({
    fontSize: `${subtitleSize}px`,
    fontFamily: secondaryFontName ? `'${secondaryFontName}', sans-serif` : 'inherit'
  });

  const getTextStyle = () => ({
    fontSize: `${textSize}px`
  });

  return (
    <div className={styles.typographyEditor}>
      {/* Columna 1: Editor de fuentes */}
      <div className={styles.editorColumn}>
        <h2>🔤 Editor de Tipografía</h2>
        
        <div className={styles.controlGroup}>
          <label>Tamaño del Título: {titleSize}px</label>
          <input 
            type="range" 
            value={titleSize} 
            onChange={(e) => setTitleSize(parseInt(e.target.value))}
            min="12" 
            max="72" 
            className={styles.slider} 
          />
        </div>
        
        <div className={styles.controlGroup}>
          <label>Tamaño del Subtítulo: {subtitleSize}px</label>
          <input 
            type="range" 
            value={subtitleSize} 
            onChange={(e) => setSubtitleSize(parseInt(e.target.value))}
            min="10" 
            max="48" 
            className={styles.slider} 
          />
        </div>
        
        <div className={styles.controlGroup}>
          <label>Tamaño del Texto: {textSize}px</label>
          <input 
            type="range" 
            value={textSize} 
            onChange={(e) => setTextSize(parseInt(e.target.value))}
            min="8" 
            max="24" 
            className={styles.slider} 
          />
        </div>
        
        <div className={styles.fontUpload}>
          <h3>Subir Fuentes TTF</h3>
          <div className={styles.uploadGroup}>
            <label style={{ color: 'black' }}>Fuente Principal (para títulos):</label>
            <input 
              type="file" 
              ref={primaryFontInputRef} 
              onChange={(e) => handleFontUpload('primary', e)} 
              accept=".ttf" 
              hidden 
            />
            <button 
              onClick={() => primaryFontInputRef.current.click()} 
              className={styles.uploadBtn}
            >
              <span style={{ color: 'black' }}>
                {primaryFontName || 'Seleccionar archivo .ttf'}
              </span>
            </button>
            {fontError.primary && (
              <small className={styles.error}>{fontError.primary}</small>
            )}
          </div>
          
          <div className={styles.uploadGroup}>
            <label style={{ color: 'black' }}>Fuente Secundaria (para subtítulos y texto):</label>
            <input 
              type="file" 
              ref={secondaryFontInputRef} 
              onChange={(e) => handleFontUpload('secondary', e)} 
              accept=".ttf" 
              hidden 
            />
            <button 
              onClick={() => secondaryFontInputRef.current.click()} 
              className={styles.uploadBtn}
            >
              <span style={{ color: 'black' }}>
                {secondaryFontName || 'Seleccionar archivo .ttf'}
              </span>
            </button>
            {fontError.secondary && (
              <small className={styles.error}>{fontError.secondary}</small>
            )}
          </div>
        </div>
        
        <div className={styles.actionButtons}>
          <button className={styles.saveBtn}>
            Guardar Configuración
          </button>
          <button onClick={resetAll} className={styles.resetBtn}>
            Restablecer Valores
          </button>
        </div>
      </div>
      
      {/* Columna 2: Configuraciones guardadas */}
      <div className={styles.savedColumn}>
        <h2>💾 Configuraciones Guardadas</h2>
        
        {savedConfigs.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay configuraciones guardadas</p>
          </div>
        ) : (
          <div className={styles.configList}>
            {savedConfigs.map((config, index) => (
              <div 
                key={config.font_id || index}
                className={styles.configItem}
              >
                <div className={styles.configPreview}>
                  <p 
                    className={styles.previewTitle} 
                    style={{ fontSize: `${config.title}px` }}
                  >
                    Título {config.title}px
                  </p>
                  <p 
                    className={styles.previewSubtitle} 
                    style={{ fontSize: `${config.sub_title}px` }}
                  >
                    Subtítulo {config.sub_title}px
                  </p>
                  <p 
                    className={styles.previewText} 
                    style={{ fontSize: `${config.paragraph}px` }}
                  >
                    Texto normal {config.paragraph}px
                  </p>
                </div>
                <div className={styles.configMeta}>
                  {config.fontFamily?.name_principal && (
                    <span>Principal: {config.fontFamily.name_principal}</span>
                  )}
                  {config.fontFamily?.name_secundary && (
                    <span>Secundaria: {config.fontFamily.name_secundary}</span>
                  )}
                </div>
                <div className={styles.configActions}>
                  <button 
                    className={styles.aplicarBtn} 
                    onClick={() => applyFontStyle(config)}
                  >
                    Aplicar
                  </button>
                  <button 
                    className={styles.editarBtn} 
                    onClick={() => handleEdit(config)}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteFont(config.font_id)} 
                    className={styles.deleteBtn}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Columna 3: Vista previa en tiempo real */}
      <div className={styles.previewColumn}>
        <h2>👁️ Vista Previa</h2>
        <div className={styles.previewContent}>
          <h1 style={getTitleStyle()}>
            Título de Ejemplo
          </h1>
          <h2 style={getSubtitleStyle()}>
            Este es un subtítulo
          </h2>
          <p style={getTextStyle()}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          
          {(primaryFontName || secondaryFontName) && (
            <div className={styles.fontDisplay}>
              <h3>Fuentes cargadas:</h3>
              {primaryFontName && (
                <p style={{ color: 'black' }}>🔤 Primaria: {primaryFontName} (aplica a títulos)</p>
              )}
              {secondaryFontName && (
                <p style={{ color: 'black' }}>🔤 Secundaria: {secondaryFontName} (aplica a subtítulos y texto)</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypographyEditor;