//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { Routes, Route } from "react-router";
import Principal from "./PaginaPrincipal/Principal"
import Header from "./PaginaPrincipal/components/header";
import Footer from "./PaginaPrincipal/components/Footer";
import './App.css'

function App() {

  return (
    <div className="App">
      <Header></Header>
      <Routes>
        <Route path="/" element={<Principal></Principal>}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  )
}

export default App
