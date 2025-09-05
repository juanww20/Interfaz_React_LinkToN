import React from 'react';
import intro_svg from '../../assets/img/intro-img.svg';

const Intro = () => {
  // Función para hacer scroll suave a una sección
  const scrollToSection = (sectionId, e) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="intro" className="clearfix">
      <div className="container">
        <div className="intro-img">
          <img src={intro_svg} alt="Intro" className="img-fluid" />
        </div>

        <div className="intro-info">
          <h2>
            We provide<br /><span>solutions</span><br />for your business!
          </h2>
          <div>
            <a href="#about" className="btn-get-started scrollto" onClick={(e) => scrollToSection('about', e)}>
              Get Started
            </a>
            <a href="#services" className="btn-services scrollto" onClick={(e) => scrollToSection('services', e)}>
              Our Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;