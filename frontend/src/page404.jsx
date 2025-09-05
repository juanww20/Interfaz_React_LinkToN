import React from 'react'
import Icono_404 from './assets/page404.gif'

function Page404() {
  // Puedes definir estas variables según tu layout
  const headerHeight = '80px'; // Ejemplo: altura del header
  const footerHeight = '60px'; // Ejemplo: altura del footer
  
  const errorMinimalStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: `calc(100vh - ${headerHeight} - ${footerHeight})`,
    backgroundColor: '#fff',
    textAlign: 'center'
  };

  const errorMessageStyle = {
    // Estilos para el contenedor del mensaje si es necesario
  };

  const titleStyle = {
    fontSize: 'var(--text-font)', // Usar variable CSS
    margin: '0',
    color: '#333',
    fontWeight: '300'
  };

  const paragraphStyle = {
    fontSize: 'var(--text-font)', // Usar variable CSS
    color: '#666',
    marginTop: '0.5rem'
  };

  return (
    <div style={errorMinimalStyle}>
      <div style={errorMessageStyle}>
        <img src={Icono_404} alt="404" style={{width:'80%', height:'auto'}}/>
        <h1 style={titleStyle}>404</h1>
        <p style={paragraphStyle}>Página no encontrada</p>
      </div>
    </div>
  );
}

export default Page404