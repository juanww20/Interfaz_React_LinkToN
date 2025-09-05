//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { useEffect } from 'react'
import { Routes, Route } from "react-router";
import Principal from "./PaginaPrincipal/Principal"
import Admin from "./Administrador/Admin";
import Login from "./PaginaLogin/Login";
import Page404 from "./page404";
import UsuarioPerfil from "./PaginaUsuario/UsuarioPerfil";
import MultiStepForm from "./PaginaUsuario/MultiStepForm";
import Header from "./PaginaPrincipal/components/header";
import Footer from "./PaginaPrincipal/components/Footer";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./store/AuthContext";
import { useStyle } from "./store/StyleContext"
import './App.css'

function App() {

  const { checkSession } = useAuth();
  const { loadFontFromStorage, loadPaletteFromStorage } = useStyle();

  useEffect(() => {
    // lo que en Vue es onMounted
    const init = async () => {
      await checkSession();
      loadFontFromStorage();
      loadPaletteFromStorage();
      
    };
    init();
  }, []); // [] asegura que se ejecuta una sola vez al montar

  return (
    <div className="App">
      <Header />

      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas para admin */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/administrador" element={<Admin />} />
        </Route>

        {/* Rutas protegidas para usuario */}
        <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route path="/perfil" element={<UsuarioPerfil />} />
          <Route path="/editar" element={<MultiStepForm />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
