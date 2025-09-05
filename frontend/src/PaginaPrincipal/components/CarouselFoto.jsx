// src/components/ImageCarousel.jsx
import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import Swal from 'sweetalert2';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './modalfoto.css';
import { imageService } from '../../services/project_4/multimediaService';

function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const ImageCarousel = ({ showDelete = false, isAdmin = false }) => {
  const [imagenes, setImagenes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const modalImageRef = useRef(null);

  // Fetch imágenes del backend
  const fetchImages = async () => {
    try {
      const response = await imageService.getImages();
      if (response && response.data) setImagenes(response.data);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Abrir / cerrar modal
  const openModal = (image) => {
    setSelectedImage(image);
    setImageLoaded(false);
    setImageDimensions({ width: 0, height: 0 });
  };
  const closeModal = () => setSelectedImage(null);

  // Dimensiones de la imagen del modal
  const handleImageLoad = () => {
    if (modalImageRef.current) {
      setImageDimensions({
        width: modalImageRef.current.naturalWidth,
        height: modalImageRef.current.naturalHeight,
      });
      setImageLoaded(true);
    }
  };

  // Eliminar imagen (solo admin + showDelete)
  const confirmDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar imagen?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await imageService.deleteImage(id);
        await fetchImages();
        Swal.fire('Eliminada', 'La imagen ha sido eliminada', 'success');
        if (selectedImage?.image_id === id) closeModal();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar la imagen', 'error');
      }
    }
  };

  // Cerrar modal con ESC y bloquear scroll de fondo
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && closeModal();
    if (selectedImage) {
      document.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  // Configuración de React-Slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
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

  return (
    <>
      <header className="header">
        <h3 style={{ fontSize: 'var(--title-font)', textAlign: 'center' }}>Carousel</h3>
      </header>

      <div className="contendor">
        <Slider {...settings}>
          {imagenes.map((image) => (
            <div key={image.image_id || image.url} className="carousel-slide">
              <div className="custom-slide" onClick={() => openModal(image)}>
                <img src={image.url} alt={image.name} className="slide-img" />
                {showDelete && isAdmin && (
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(image.image_id);
                    }}
                    title="Eliminar imagen"
                  >
                    🗑 Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>

            <div className="modal-grid">
              <div className="image-container">
                <img
                  ref={modalImageRef}
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  onLoad={handleImageLoad}
                  className="modal-image"
                />
                {!imageLoaded && <div className="image-loading">Cargando imagen...</div>}
              </div>

              <div className="details-container">
                <h3 className="image-title">{selectedImage.name}</h3>

                <div className="detail-item">
                  <span className="detail-label">Dimensiones:</span>
                  <span className="detail-value">
                    {imageLoaded
                      ? `${imageDimensions.width}px × ${imageDimensions.height}px`
                      : 'Cargando...'}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Formato:</span>
                  <span className="detail-value">{selectedImage.format || '—'}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Tamaño:</span>
                  <span className="detail-value">{formatFileSize(selectedImage.size)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
