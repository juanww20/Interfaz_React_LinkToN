import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import styles from "../Admin.module.css";
import { apiService } from "../../services/project_1/apiService"; // 👈 igual que en Vue
import { useStyle } from "../../store/StyleContext"; // 👈 tu contexto adaptado en React

const ColoresComponente = () => {
  const { applyPalette } = useStyle();

  // 🎨 Estilos por defecto
  const defaultStyles = {
    color_one: "#092db0",
    color_two: "#4B97F5",
    color_three: "#AED6F5",
    color_four: "#0D0D2E",
    color_five: "#FFFFFF",
  };

  // 🔴 Estados locales
  const [headerBgColor, setHeaderBgColor] = useState("");
  const [titleColor, setTitleColor] = useState("");
  const [divBorderColor, setDivBorderColor] = useState("");
  const [cardBgColor, setCardBgColor] = useState("");
  const [footerBgColor, setFooterBgColor] = useState("");
  const [titleFontSize] = useState(32);

  const [saveMode, setSaveMode] = useState("guardar");
  const [editingItem, setEditingItem] = useState(null);
  const [savedStylesColor, setSavedStylesColor] = useState([]);
  const [styleCounter, setStyleCounter] = useState(1);

  // 🟢 Inicializar colores (similar a colorsReactive en Vue)
  useEffect(() => {
    const saved = localStorage.getItem("activePalette");
    if (saved) {
      const palette = JSON.parse(saved);
      setHeaderBgColor(palette.colors.color_one);
      setTitleColor(palette.colors.color_two);
      setDivBorderColor(palette.colors.color_three);
      setCardBgColor(palette.colors.color_four);
      setFooterBgColor(palette.colors.color_five);
    } else {
      setHeaderBgColor(defaultStyles.color_one);
      setTitleColor(defaultStyles.color_two);
      setDivBorderColor(defaultStyles.color_three);
      setCardBgColor(defaultStyles.color_four);
      setFooterBgColor(defaultStyles.color_five);
    }
  }, []);

  // 🟠 Cargar paletas del backend
  const fetchSavedStyles = async () => {
    const styles = await apiService.getStyles();
    setSavedStylesColor(styles);
    setStyleCounter(styles.length + 1);
  };

  useEffect(() => {
    fetchSavedStyles();
  }, []);

  // 🟡 Guardar o Editar
  const handleSaveOrEdit = () => {
    if (saveMode === "guardar") {
      saveCurrentStyle();
    } else if (editingItem) {
      handleSaveEdit(editingItem);
    } else {
      Swal.fire("Error", "No hay paleta seleccionada para editar", "error");
    }
  };

  // 🟢 Guardar nueva paleta
  const saveCurrentStyle = async () => {
    const newStyle = {
      name: `Paleta: ${styleCounter}`,
      colors: {
        color_one: headerBgColor,
        color_two: titleColor,
        color_three: divBorderColor,
        color_four: cardBgColor,
        color_five: footerBgColor,
      },
    };

    await apiService.createStyles(newStyle);
    Swal.fire("¡Guardado!", "La paleta ha sido guardada.", "success");
    await fetchSavedStyles();
  };

  // 🟠 Editar paleta
  const handleEdit = (item) => {
    setEditingItem(item);
    setSaveMode("editar");
    setHeaderBgColor(item.colors.color_one);
    setTitleColor(item.colors.color_two);
    setDivBorderColor(item.colors.color_three);
    setCardBgColor(item.colors.color_four);
    setFooterBgColor(item.colors.color_five);
  };

  const handleSaveEdit = async (item) => {
    await apiService.updateColor(item.colors.colors_id, {
      color_one: headerBgColor,
      color_two: titleColor,
      color_three: divBorderColor,
      color_four: cardBgColor,
      color_five: footerBgColor,
    });
    setSaveMode("guardar");
    setEditingItem(null);
    Swal.fire("Editado", "La paleta fue actualizada.", "success");
    await fetchSavedStyles();
  };

  // 🔵 Restablecer
  const resetStyles = () => {
    setHeaderBgColor(defaultStyles.color_one);
    setTitleColor(defaultStyles.color_two);
    setDivBorderColor(defaultStyles.color_three);
    setCardBgColor(defaultStyles.color_four);
    setFooterBgColor(defaultStyles.color_five);

    const palette = { colors: defaultStyles };
    Swal.fire("¡Estilos restablecidos!", "", "success");
    applyColorPalette(palette);
  };

  // 🟣 Aplicar paleta
  const applyColorPalette = (palette) => {
    setHeaderBgColor(palette.colors.color_one);
    setTitleColor(palette.colors.color_two);
    setDivBorderColor(palette.colors.color_three);
    setCardBgColor(palette.colors.color_four);
    setFooterBgColor(palette.colors.color_five);

    Swal.fire("¡Paleta aplicada!", "", "success");
    applyPalette(palette); // 👈 aplica en el StyleContext
  };

  // 🔴 Eliminar
  const handleDeletePalette = async (id) => {
    await apiService.deleteColors(id);
    Swal.fire("Eliminado", "La paleta fue eliminada.", "success");
    await fetchSavedStyles();
  };

  return (
    <div className={`${styles.row} ${styles.colorsection}`}>
      {/* 🎛 Panel de control */}
      <div className={styles.controlPanel}>
        <div className={styles.controlGroup}>
          <h2>🎨 Colores</h2>
        </div>

        {/* Inputs de colores */}
        <div className={styles.controlGroup}>
          <label>Color Primario:</label>
          <input
            type="color"
            value={headerBgColor}
            onChange={(e) => setHeaderBgColor(e.target.value)}
          />
          <span className={styles.colorHex}>{headerBgColor}</span>
        </div>

        <div className={styles.controlGroup}>
          <label>Color Secundario:</label>
          <input
            type="color"
            value={titleColor}
            onChange={(e) => setTitleColor(e.target.value)}
          />
          <span className={styles.colorHex}>{titleColor}</span>
        </div>

        <div className={styles.controlGroup}>
          <label>Color Terciario:</label>
          <input
            type="color"
            value={divBorderColor}
            onChange={(e) => setDivBorderColor(e.target.value)}
          />
          <span className={styles.colorHex}>{divBorderColor}</span>
        </div>

        <div className={styles.controlGroup}>
          <label>Color Neutro 1:</label>
          <input
            type="color"
            value={cardBgColor}
            onChange={(e) => setCardBgColor(e.target.value)}
          />
          <span className={styles.colorHex}>{cardBgColor}</span>
        </div>

        <div className={styles.controlGroup}>
          <label>Color Neutro 2:</label>
          <input
            type="color"
            value={footerBgColor}
            onChange={(e) => setFooterBgColor(e.target.value)}
          />
          <span className={styles.colorHex}>{footerBgColor}</span>
        </div>

        <div className={styles.savesection}>
          <button onClick={handleSaveOrEdit}>
            {saveMode === "guardar" ? "Guardar" : "Editar"}
          </button>
          <button className={styles.saveBtn} onClick={resetStyles}>
            Restablecer paleta
          </button>
        </div>
      </div>

      {/* 🎨 Paletas guardadas */}
      <div>
        <div className={styles.row}>
          <fieldset className={styles.controlPanel}>
            <div className={styles.savedstyles}>
              <h3>Estilos guardados</h3>
              <div className={styles.customScrollbar}>
                {savedStylesColor.map((palette) => (
                  <div key={palette.palette_id} className={styles.savedStyleItem}>
                    <span>{palette.name}</span>
                    <div className={styles.colorPreview}>
                      {[
                        palette.colors.color_one,
                        palette.colors.color_two,
                        palette.colors.color_three,
                        palette.colors.color_four,
                        palette.colors.color_five,
                      ].map((color, idx) => (
                        <div
                          key={idx}
                          className={styles.colorBox}
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                    <div className={styles.styleActions}>
                      <button onClick={() => applyColorPalette(palette)}>
                        ✅ Aplicar
                      </button>
                      <button onClick={() => handleEdit(palette)}>✏️ Editar</button>
                      <button
                        onClick={() => handleDeletePalette(palette.colors.colors_id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* 🖼 Zona de pruebas */}
      <div className={styles.playground}>
        <header style={{ backgroundColor: headerBgColor }}>
          <h1 style={{ color: titleColor, fontSize: `${titleFontSize}px` }}>
            Título
          </h1>
        </header>

        <div style={{ borderColor: divBorderColor }} className={styles.divWithBorder}>
          Hola Mundo
        </div>

        <div className={styles.card} style={{ backgroundColor: cardBgColor }}>
          <h2>Título de Carta</h2>
          <p className={styles.content}>
            Hola, aquí donde hace las pruebas para cambio de letras.
          </p>
        </div>

        <footer style={{ backgroundColor: footerBgColor }}>
          <p>Footer © MJS</p>
        </footer>
      </div>
    </div>
  );
};

export default ColoresComponente;
