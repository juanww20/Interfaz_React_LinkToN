import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/img/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Verificar si la ruta actual coincide con la pasada
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Verificar tamaño de pantalla
  const checkScreenSize = () => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (!mobile) {
      setIsMenuOpen(false);
    }
  };

  // Alternar menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar menú
  const closeMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  // Alternar dropdown en móviles
  const toggleDropdown = (e) => {
    if (isMobile) {
      e.preventDefault();
      const parent = e.target.closest('li');
      parent.classList.toggle('active');
    }
  };

  // Efecto para verificar el tamaño de pantalla
  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <>
      <header id="header" className="fixed-top">
        <div className="container">
          <div className="logo float-left">
            <Link to="/" className="scrollto" onClick={closeMenu}>
              <img src={logo} alt="Logo" className="img-fluid" />
            </Link>
          </div>

          {/* Botón hamburguesa para móviles */}
          <button
            className={`navbar-toggle ${isMenuOpen ? 'is-active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            <i className="fa fa-bars Hamburguesa"></i>
          </button>

          {/* Navbar para desktop y móvil */}
          <nav className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
            <ul className="navbar-links">
              <li className={isActive('/') ? 'active' : ''}>
                <Link to="/" onClick={closeMenu}>Home</Link>
              </li>
              <li>
                <a href="#about" onClick={closeMenu}>About Us</a>
              </li>
              <li>
                <a href="#services" onClick={closeMenu}>Services</a>
              </li>
              <li>
                <a href="#portfolio" onClick={closeMenu}>Portfolio</a>
              </li>
              <li className="drop-down">
                <a href="#" onClick={toggleDropdown}>Drop Down</a>
                <ul>
                  <li><a href="#" onClick={closeMenu}>Drop Down 1</a></li>
                  <li className="drop-down">
                    <a href="#" onClick={toggleDropdown}>Drop Down 2</a>
                    <ul>
                      <li><a href="#" onClick={closeMenu}>Deep Drop Down 1</a></li>
                      <li><a href="#" onClick={closeMenu}>Deep Drop Down 2</a></li>
                      <li><a href="#" onClick={closeMenu}>Deep Drop Down 3</a></li>
                      <li><a href="#" onClick={closeMenu}>Deep Drop Down 4</a></li>
                      <li><a href="#" onClick={closeMenu}>Deep Drop Down 5</a></li>
                    </ul>
                  </li>
                  <li><a href="#" onClick={closeMenu}>Drop Down 3</a></li>
                  <li><a href="#" onClick={closeMenu}>Drop Down 4</a></li>
                  <li><a href="#" onClick={closeMenu}>Drop Down 5</a></li>
                </ul>
              </li>
              <li>
                <a href="#contact" onClick={closeMenu}>Contact Us</a>
              </li>
              <li>
                <Link to="/admin" onClick={closeMenu}>Admin</Link>
              </li>
              <li>
                <Link to="/usuario" onClick={closeMenu}>Usuario Perfil</Link>
              </li>
              <li>
                <Link to="/login" onClick={closeMenu}>Login</Link>
              </li>
            </ul>
          </nav>

          {/* Overlay para móviles */}
          <div 
            className={`navbar-overlay ${isMenuOpen ? 'is-active' : ''}`}
            onClick={closeMenu}
          ></div>
        </div>
      </header>
    </>
  );
};

export default Header;