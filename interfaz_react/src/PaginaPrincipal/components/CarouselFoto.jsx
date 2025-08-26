import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './modalfoto.css'

// Importar imágenes
import t1 from '../../assets/img/carousel/testimonial-1.jpg';
import t2 from '../../assets/img/carousel/testimonial-2.jpg';
import t3 from '../../assets/img/carousel/testimonial-3.jpg';
import t4 from '../../assets/img/carousel/testimonial-4.jpg';
import t5 from '../../assets/img/carousel/testimonial-5.jpg';
import t6 from '../../assets/img/portfolio/card1.jpg';

const Carousel = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const modalImageRef = useRef(null);

  const imagenes = [
    { img: t1, title: 'Imagen 1' },
    { img: t2, title: 'Imagen 2' },
    { img: t3, title: 'Imagen 3' },
    { img: t4, title: 'Imagen 4' },
    { img: t5, title: 'Imagen 5' },
    { img: t6, title: 'Tarjeta Creativa' }
  ];

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Abrir modal con la imagen seleccionada
  const openModal = (image) => {
    setSelectedImage(image);
    setImageLoaded(false);
    setImageDimensions({ width: 0, height: 0 });
  };

  // Cerrar modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Cuando la imagen del modal se carga
  const handleImageLoad = () => {
    if (modalImageRef.current) {
      setImageDimensions({
        width: modalImageRef.current.naturalWidth,
        height: modalImageRef.current.naturalHeight
      });
      setImageLoaded(true);
    }
  };

  // Obtener formato de la imagen
  const getImageFormat = () => {
    if (!selectedImage) return '';
    const src = selectedImage.img;
    if (typeof src === 'string') {
      const extension = src.split('.').pop().toLowerCase();
      return extension.toUpperCase();
    }
    return 'JPG'; // Valor por defecto
  };

  // Calcular tamaño aproximado del archivo
  const getFileSize = () => {
    if (!imageLoaded || imageDimensions.width === 0 || imageDimensions.height === 0) {
      return 'Calculando...';
    }

    // Estimación basada en dimensiones (3 bytes por pixel para RGB)
    const estimatedSizeBytes = imageDimensions.width * imageDimensions.height * 3;
    
    if (estimatedSizeBytes < 1024) {
      return `${estimatedSizeBytes} B`;
    } else if (estimatedSizeBytes < 1048576) {
      return `${(estimatedSizeBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(estimatedSizeBytes / 1048576).toFixed(1)} MB`;
    }
  };

  // Cerrar modal al presionar Escape
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };
    
    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    } else {
      document.body.style.overflow = 'auto'; // Permitir scroll del body
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  return (
    <>
      <header className="header">
        <h3 style={{ fontSize: 'var(--title-font)', textAlign: 'center' }}>Carousel</h3>
      </header>
      
      <div className="contendor">
        <Slider {...settings}>
          {imagenes.map((image, index) => (
            <div 
              key={index} 
              className="custom-slide"
              onClick={() => openModal(image)}
              style={{ cursor: 'pointer' }}
            >
              <img src={image.img} alt={image.title} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Modal para mostrar detalles de la imagen */}
      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            
            <div className="modal-body">
              <div className="modal-image-container">
                <img
                  ref={modalImageRef}
                  src={selectedImage.img}
                  alt={selectedImage.title}
                  onLoad={handleImageLoad}
                  className="modal-image"
                />
                {!imageLoaded && <div className="image-loading">Cargando imagen...</div>}
              </div>
              
              <div className="modal-details">
                <h3 className="image-title">{selectedImage.title}</h3>
                
                <div className="detail-row">
                  <span className="detail-label">Dimensiones:</span>
                  <span className="detail-value">
                    {imageLoaded ? `${imageDimensions.width} × ${imageDimensions.height} px` : 'Cargando...'}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Formato:</span>
                  <span className="detail-value">{getImageFormat()}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Tamaño aproximado:</span>
                  <span className="detail-value">{getFileSize()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Carousel;