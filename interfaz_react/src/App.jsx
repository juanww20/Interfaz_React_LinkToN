//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { Routes, Route } from "react-router";
import Principal from "./PaginaPrincipal/Principal"
import Admin from "./Administrador/Admin";
import Login from "./PaginaLogin/Login";
import UsuarioPerfil from "./PaginaUsuario/UsuarioPerfil";
import Header from "./PaginaPrincipal/components/header";
import Footer from "./PaginaPrincipal/components/Footer";
import './App.css'

function App() {

  return (
    <div className="App">
      <Header></Header>
      <Routes>
        <Route path="/" element={<Principal></Principal>}></Route>
        <Route path="/admin" element={<Admin></Admin>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/usuario" element={<UsuarioPerfil></UsuarioPerfil>}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  )
}

export default App
