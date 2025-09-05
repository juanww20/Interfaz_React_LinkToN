import React, { createContext, useContext, useReducer, useEffect } from "react";

interface Palette {
  color_one: string;
  color_two: string;
  color_three: string;
  color_four: string;
  color_five: string;
}

interface Font {
  title: number;
  sub_title: number;
  paragraph: number;
  principalFontName: string;
  secondaryFontName: string;
}

interface StyleState {
  palette: Palette;
  font: Font;
}

type Action =
  | { type: "APPLY_PALETTE"; payload: { colors: Palette } }
  | { type: "APPLY_FONT"; payload: any }
  | { type: "LOAD_PALETTE"; payload: any }
  | { type: "LOAD_FONT"; payload: any };

const initialState: StyleState = {
  palette: {
    color_one: "#092db0",
    color_two: "#4B97F5",
    color_three: "#AED6F5",
    color_four: "#0D0D2E",
    color_five: "#FFFFFF",
  },
  font: {
    title: 32,
    sub_title: 24,
    paragraph: 16,
    principalFontName: "Arial",
    secondaryFontName: "Times New Roman",
  },
};

function styleReducer(state: StyleState, action: Action): StyleState {
  switch (action.type) {
    case "APPLY_PALETTE":
      applyPaletteToDOM(action.payload.colors);
      localStorage.setItem("activePalette", JSON.stringify(action.payload));
      return { ...state, palette: action.payload.colors };

    case "APPLY_FONT":
      applyFontToDOM(action.payload);
      localStorage.setItem("activeFont", JSON.stringify(action.payload));
      return {
        ...state,
        font: {
          ...state.font,
          ...action.payload,
        },
      };

    case "LOAD_PALETTE":
      applyPaletteToDOM(action.payload.colors);
      return { ...state, palette: action.payload.colors };

    case "LOAD_FONT":
      // inyectar fonts
      if (action.payload.fontFamily?.url_principal) {
        addFontStyle(`@font-face {
          font-family: '${action.payload.fontFamily.name_principal}';
          src: url('${action.payload.fontFamily.url_principal}') format('truetype');
        }`);
      }
      if (action.payload.fontFamily?.url_secundary) {
        addFontStyle(`@font-face {
          font-family: '${action.payload.fontFamily.name_secundary}';
          src: url('${action.payload.fontFamily.url_secundary}') format('truetype');
        }`);
      }
      applyFontToDOM(action.payload);
      return { ...state, font: { ...state.font, ...action.payload } };

    default:
      return state;
  }
}

const StyleContext = createContext<{
  state: StyleState;
  applyPalette: (palette: { colors: Palette }) => void;
  applyFont: (font: any) => void;
  loadPaletteFromStorage: () => void;
  loadFontFromStorage: () => void;
}>({
  state: initialState,
  applyPalette: () => {},
  applyFont: () => {},
  loadPaletteFromStorage: () => {},
  loadFontFromStorage: () => {},
});

// Helpers DOM
function applyPaletteToDOM(palette: Palette) {
  const root = document.documentElement.style;
  root.setProperty("--primary-color", palette.color_one);
  root.setProperty("--secondary-color", palette.color_two);
  root.setProperty("--tertiary-color", palette.color_three);
  root.setProperty("--dark-color", palette.color_four);
  root.setProperty("--ligth-color", palette.color_five);
}

function applyFontToDOM(font: any) {
  const root = document.documentElement.style;
  if (font.title) root.setProperty("--title-font", `${font.title}px`);
  if (font.sub_title) root.setProperty("--subtitle-font", `${font.sub_title}px`);
  if (font.paragraph) root.setProperty("--text-font", `${font.paragraph}px`);
  if (font.fontFamily?.name_principal) root.setProperty("--font-principal", font.fontFamily.name_principal);
  if (font.fontFamily?.name_secundary) root.setProperty("--font-secundaria", font.fontFamily.name_secundary);
}

function addFontStyle(css: string) {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

export const StyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(styleReducer, initialState);

  const applyPalette = (palette: { colors: Palette }) =>
    dispatch({ type: "APPLY_PALETTE", payload: palette });

  const applyFont = (font: any) => dispatch({ type: "APPLY_FONT", payload: font });

  const loadPaletteFromStorage = () => {
    const saved = localStorage.getItem("activePalette");
    if (saved) {
      const palette = JSON.parse(saved);
      dispatch({ type: "LOAD_PALETTE", payload: palette });
    }
  };

  const loadFontFromStorage = () => {
    const saved = localStorage.getItem("activeFont");
    if (saved) {
      const font = JSON.parse(saved);
      dispatch({ type: "LOAD_FONT", payload: font });
    }
  };

  useEffect(() => {
    loadPaletteFromStorage();
    loadFontFromStorage();
  }, []);

  return (
    <StyleContext.Provider
      value={{ state, applyPalette, applyFont, loadPaletteFromStorage, loadFontFromStorage }}
    >
      {children}
    </StyleContext.Provider>
  );
};

export const useStyle = () => useContext(StyleContext);
