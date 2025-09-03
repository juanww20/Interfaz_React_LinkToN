//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { Routes, Route } from "react-router";
import Principal from "./PaginaPrincipal/Principal"
import Admin from "./Administrador/Admin";
import Login from "./PaginaLogin/Login";
import Page404 from "./page404";
import UsuarioPerfil from "./PaginaUsuario/UsuarioPerfil";
import MultiStepForm from "./PaginaUsuario/MultiStepForm";
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
        <Route path="/editar" element={<MultiStepForm></MultiStepForm>}></Route>
        <Route path="*" element={<Page404></Page404>}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  )
}

export default App
