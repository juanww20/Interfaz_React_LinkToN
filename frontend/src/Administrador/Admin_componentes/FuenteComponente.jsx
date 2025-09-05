import React, { useState, useRef, useEffect, use } from 'react';
import Swal from 'sweetalert2';
import styles from './EditorFuente.module.css';
import { apiService } from '../../services/project_1/apiService'; // Ajusta según tu estructura
import { useStyle } from '../../store/StyleContext'; // Ajusta según tu estructura

const defaultFontStyle = {
  title: 36,
  sub_title: 24,
  paragraph: 16,
  fontFamily: {
    name_principal: 'Arial',
    url_principal: '',
    name_secundary: 'Times New Roman',
    url_secundary: ''
  }
};

const TypographyEditor = () => {
  const styleStore = useStyle();

  // Estados principales
  const [titleSize, setTitleSize] = useState(defaultFontStyle.title);
  const [subtitleSize, setSubtitleSize] = useState(defaultFontStyle.sub_title);
  const [textSize, setTextSize] = useState(defaultFontStyle.paragraph);

  const [primaryFontName, setPrimaryFontName] = useState(defaultFontStyle.fontFamily.name_principal);
  const [secondaryFontName, setSecondaryFontName] = useState(defaultFontStyle.fontFamily.name_secundary);
  const [primaryFontFile, setPrimaryFontFile] = useState(null);
  const [secondaryFontFile, setSecondaryFontFile] = useState(null);
  const [primaryFontUrl, setPrimaryFontUrl] = useState('');
  const [secondaryFontUrl, setSecondaryFontUrl] = useState('');

  const [fontError, setFontError] = useState({ primary: '', secondary: '' });
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [activeConfig, setActiveConfig] = useState(null);
  const [saveMode, setSaveMode] = useState('guardar');
  const [editingItem, setEditingItem] = useState(null);

  // Refs para inputs de archivos
  const primaryFontInputRef = useRef(null);
  const secondaryFontInputRef = useRef(null);

  // Fetch inicial de configuraciones guardadas
  const fetchSavedFont = async () => {
    const fonts = await apiService.getFontStyles();
    setSavedConfigs(fonts);
  };

  useEffect(() => {
    fetchSavedFont();
  }, []);

  // Helper para convertir archivo a base64
  const fileToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Función para añadir fuentes dinámicamente
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

  const handleFontUpload = (type, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.ttf')) {
      setFontError(prev => ({ ...prev, [type]: 'Solo se permiten archivos .ttf' }));
      return;
    }

    setFontError(prev => ({ ...prev, [type]: '' }));
    const fontUrl = URL.createObjectURL(file);

    if (type === 'primary') {
      setPrimaryFontFile(file);
      setPrimaryFontName(file.name.replace('.ttf', ''));
      setPrimaryFontUrl(fontUrl);
      addFontToDocument(file.name.replace('.ttf', ''), fontUrl);
    } else {
      setSecondaryFontFile(file);
      setSecondaryFontName(file.name.replace('.ttf', ''));
      setSecondaryFontUrl(fontUrl);
      addFontToDocument(file.name.replace('.ttf', ''), fontUrl);
    }
  };

  const applyFontStyle = (font) => {
    setTitleSize(font.title);
    setSubtitleSize(font.sub_title);
    setTextSize(font.paragraph);

    if (font.fontFamily) {
      if (font.fontFamily.name_principal) setPrimaryFontName(font.fontFamily.name_principal);
      if (font.fontFamily.name_secundary) setSecondaryFontName(font.fontFamily.name_secundary);

      if (font.fontFamily.url_principal) addFontToDocument(font.fontFamily.name_principal, font.fontFamily.url_principal);
      if (font.fontFamily.url_secundary) addFontToDocument(font.fontFamily.name_secundary, font.fontFamily.url_secundary);

      styleStore.applyFont(font);
    }

    Swal.fire({
      title: "¡Configuración aplicada!",
      icon: "success",
      timer: 1200,
      showConfirmButton: false
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setSaveMode('editar');
    setActiveConfig(item.font_id);
    setTitleSize(item.title);
    setSubtitleSize(item.sub_title);
    setTextSize(item.paragraph);
    setPrimaryFontName(item.fontFamily?.name_principal || '');
    setSecondaryFontName(item.fontFamily?.name_secundary || '');
    setPrimaryFontFile(null);
    setSecondaryFontFile(null);
  };

  const handleSaveOrEdit = async () => {
    if (saveMode === 'guardar') {
      await saveCurrentFont();
    } else if (editingItem) {
      await handleSaveEdit(editingItem);
    } else {
      Swal.fire('Error', 'No hay configuración seleccionada para editar', 'error');
    }
  };

  const saveCurrentFont = async () => {
    if (!primaryFontFile && !primaryFontName) {
      Swal.fire({ title: 'Error', text: 'Debes seleccionar al menos la fuente principal', icon: 'error' });
      return;
    }

    try {
      const principalBase64 = primaryFontFile ? await fileToBase64(primaryFontFile) : '';
      const secondaryBase64 = secondaryFontFile ? await fileToBase64(secondaryFontFile) : '';

      const fontConfig = {
        title: titleSize,
        sub_title: subtitleSize,
        paragraph: textSize,
        fontFamily: {
          name_principal: primaryFontName,
          url_principal: principalBase64,
          name_secundary: secondaryFontName,
          url_secundary: secondaryBase64
        }
      };

      await apiService.createFontStyles(fontConfig);
      Swal.fire({ title: '¡Configuración guardada!', icon: 'success', timer: 1200, showConfirmButton: false });
      fetchSavedFont();
    } catch (error) {
      console.error(error);
      Swal.fire({ title: 'Error', text: 'No se pudo guardar la configuración', icon: 'error' });
    }
  };

  const handleSaveEdit = async (item) => {
    let fontBase64 = primaryFontFile ? await fileToBase64(primaryFontFile) : item.fontFamily.url_principal || '';
    let secondaryFontBase64 = secondaryFontFile ? await fileToBase64(secondaryFontFile) : item.fontFamily.url_secundary || '';

    const fontStyles = { title: titleSize, sub_title: subtitleSize, paragraph: textSize };
    const fontFamily = {
      name_principal: primaryFontName,
      url_principal: fontBase64,
      name_secundary: secondaryFontName,
      url_secundary: secondaryFontBase64
    };

    await apiService.updateFont(item.font_id, fontStyles);
    await apiService.updateFontFamily(item.fontFamily_id, fontFamily);

    setSaveMode('guardar');
    setEditingItem(null);
    Swal.fire('Editado', 'La configuración fue actualizada.', 'success');
    fetchSavedFont();
  };

  const handleDeleteFont = (id) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar esta fuente?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiService.deleteFonts(id);
          Swal.fire({ title: "¡Eliminado!", text: "La fuente ha sido eliminada.", icon: "success" });
          fetchSavedFont();
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
          Swal.fire({ title: "Error", text: "No se pudo eliminar la fuente.", icon: "error" });
        }
      }
    });
  };

  const resetAll = () => {
    setTitleSize(defaultFontStyle.title);
    setSubtitleSize(defaultFontStyle.sub_title);
    setTextSize(defaultFontStyle.paragraph);
    setPrimaryFontName(defaultFontStyle.fontFamily.name_principal);
    setSecondaryFontName(defaultFontStyle.fontFamily.name_secundary);
    setPrimaryFontFile(null);
    setSecondaryFontFile(null);
    setFontError({ primary: '', secondary: '' });

    Swal.fire('¡Estilos restablecidos!', '', 'success');
    applyFontStyle(defaultFontStyle);
  };

  const getTitleStyle = () => ({ fontSize: `${titleSize}px`, fontFamily: primaryFontName || 'inherit' });
  const getSubtitleStyle = () => ({ fontSize: `${subtitleSize}px`, fontFamily: secondaryFontName || 'inherit' });
  const getTextStyle = () => ({ fontSize: `${textSize}px` });

  return (
    <div className={styles.typographyEditor}>
      {/* Editor */}
      <div className={styles.editorColumn}>
        <h2>🔤 Editor de Tipografía</h2>

        <div className={styles.controlGroup}>
          <label>Tamaño del Título: {titleSize}px</label>
          <input type="range" value={titleSize} onChange={e => setTitleSize(parseInt(e.target.value))} min="12" max="72" className={styles.slider} />
        </div>

        <div className={styles.controlGroup}>
          <label>Tamaño del Subtítulo: {subtitleSize}px</label>
          <input type="range" value={subtitleSize} onChange={e => setSubtitleSize(parseInt(e.target.value))} min="10" max="48" className={styles.slider} />
        </div>

        <div className={styles.controlGroup}>
          <label>Tamaño del Texto: {textSize}px</label>
          <input type="range" value={textSize} onChange={e => setTextSize(parseInt(e.target.value))} min="8" max="24" className={styles.slider} />
        </div>

        <div className={styles.fontUpload}>
          <h3>Subir Fuentes TTF</h3>

          <div className={styles.uploadGroup}>
            <label style={{ color: 'black' }}>Fuente Principal:</label>
            <input type="file" ref={primaryFontInputRef} onChange={e => handleFontUpload('primary', e)} accept=".ttf" hidden />
            <button onClick={() => primaryFontInputRef.current.click()} className={styles.uploadBtn}>
              <span style={{ color: 'black' }}>{primaryFontName || 'Seleccionar archivo .ttf'}</span>
            </button>
            {fontError.primary && <small className={styles.error}>{fontError.primary}</small>}
          </div>

          <div className={styles.uploadGroup}>
            <label style={{ color: 'black' }}>Fuente Secundaria:</label>
            <input type="file" ref={secondaryFontInputRef} onChange={e => handleFontUpload('secondary', e)} accept=".ttf" hidden />
            <button onClick={() => secondaryFontInputRef.current.click()} className={styles.uploadBtn}>
              <span style={{ color: 'black' }}>{secondaryFontName || 'Seleccionar archivo .ttf'}</span>
            </button>
            {fontError.secondary && <small className={styles.error}>{fontError.secondary}</small>}
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button onClick={handleSaveOrEdit} className={styles.saveBtn}>
            {saveMode === 'guardar' ? 'Guardar Configuración' : 'Editar Configuración'}
          </button>
          <button onClick={resetAll} className={styles.resetBtn}>Restablecer Valores</button>
        </div>
      </div>

      {/* Configuraciones guardadas */}
      <div className={styles.savedColumn}>
        <h2>💾 Configuraciones Guardadas</h2>
        {savedConfigs.length === 0 ? (
          <div className={styles.emptyState}><p>No hay configuraciones guardadas</p></div>
        ) : (
          <div className={styles.configList}>
            {savedConfigs.map((config, index) => (
              <div key={config.font_id || index} className={`${styles.configItem} ${activeConfig === (config.font_id || index) ? styles.active : ''}`}>
                <div className={styles.configPreview}>
                  <p className={styles.previewTitle} style={{ fontSize: `${config.title}px`, fontFamily: config.fontFamily?.name_principal || 'Arial' }}>Título {config.title}</p>
                  <p className={styles.previewSubtitle} style={{ fontSize: `${config.sub_title}px`, fontFamily: config.fontFamily?.name_secundary || 'Times New Roman' }}>Subtítulo {config.sub_title}</p>
                  <p className={styles.previewText} style={{ fontSize: `${config.paragraph}px` }}>Texto normal {config.paragraph}</p>
                </div>
                <div className={styles.configMeta}>
                  {config.fontFamily?.name_principal && <span>Principal: {config.fontFamily.name_principal}</span>}
                  {config.fontFamily?.name_secundary && <span>Secundaria: {config.fontFamily.name_secundary}</span>}
                </div>
                <div className={styles.configActions}>
                  <button className={styles.aplicarBtn} onClick={() => applyFontStyle(config)}>Aplicar</button>
                  <button className={styles.editarBtn} onClick={() => handleEdit(config)}>Editar</button>
                  <button onClick={() => handleDeleteFont(config.font_id)} className={styles.deleteBtn}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vista previa */}
      <div className={styles.previewColumn}>
        <h2>👁️ Vista Previa</h2>
        <div className={styles.previewContent}>
          <h1 style={getTitleStyle()}>Título de Ejemplo</h1>
          <h2 style={getSubtitleStyle()}>Este es un subtítulo</h2>
          <p style={getTextStyle()}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

          {(primaryFontName || secondaryFontName) && (
            <div className={styles.fontDisplay}>
              <h3>Fuentes cargadas:</h3>
              {primaryFontName && <p style={{ color: 'black' }}>🔤 Primaria: {primaryFontName}</p>}
              {secondaryFontName && <p style={{ color: 'black' }}>🔤 Secundaria: {secondaryFontName}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypographyEditor;
