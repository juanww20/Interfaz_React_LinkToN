import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import './cropper.css';
import styles from './FotosEditar.module.css';
import Icono_foto from '../../assets/foto.png';

const FotosEditar = () => {
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState('');
  const [croppedFileName, setCroppedFileName] = useState('');
  const [croppedDimensions, setCroppedDimensions] = useState({ width: 0, height: 0 });
  const [croppedFileSize, setCroppedFileSize] = useState(0);

  // Activa el input de archivo
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Maneja el cambio de archivo seleccionado
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setCroppedImage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Limpia la imagen seleccionada
  const clearImage = () => {
    setImageSrc('');
    setSelectedFile(null);
    setCroppedImage('');
    setCroppedFileName('');
    setCroppedDimensions({ width: 0, height: 0 });
    setCroppedFileSize(0);

    // Reinicia el input de archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Recorta la imagen
  const cropImage = () => {
    if (!cropperRef.current) return;

    const cropper = cropperRef.current.cropper;
    const canvas = cropper.getCroppedCanvas({
      minWidth: 1,
      minHeight: 1,
      maxWidth: 4096,
      maxHeight: 4096,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

    if (!canvas) return;

    setCroppedDimensions({
      width: canvas.width,
      height: canvas.height
    });

    canvas.toBlob((blob) => {
      setCroppedFileSize(blob.size);

      const reader = new FileReader();
      reader.onload = () => {
        setCroppedImage(reader.result);
      };
      reader.readAsDataURL(blob);
    }, selectedFile.type || 'image/png', 0.92);

    const fileName = selectedFile.name;
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex !== -1) {
      setCroppedFileName(fileName.substring(0, dotIndex) + '_recortada' + fileName.substring(dotIndex));
    } else {
      setCroppedFileName(fileName + '_recortada');
    }
  };

  // Rota la imagen
  const rotate = (degrees) => {
    if (cropperRef.current) {
      cropperRef.current.cropper.rotate(degrees);
    }
  };

  // Reinicia el cropper
  const reset = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.reset();
    }
  };

  // Formatea el tamaño del archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.imageUploader}>
      <h2 className={styles.centrar}>Subir Imagen para editar la foto</h2>
      <div className={styles.centrar}>
        <img src={Icono_foto} alt="" style={{ width: '80px', height: 'auto' }} />
      </div>

      <div className={styles.uploadSection}>
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileChange} 
          className={styles.fileInput}
        />
        <button onClick={triggerFileInput} className={styles.button}>
          Seleccionar Imagen
        </button>
        {imageSrc && (
          <button onClick={clearImage} className={`${styles.button} ${styles.clearBtn}`}>
            Borrar Foto
          </button>
        )}

        {selectedFile && (
          <div className={styles.fileInfo}>
            Seleccionado: {selectedFile.name} ({formatFileSize(selectedFile.size)})
          </div>
        )}
      </div>

      {imageSrc && (
        <div className={styles.cropperSection}>
          <div className={styles.cropperContainer}>
            <Cropper
              ref={cropperRef}
              src={imageSrc}
              aspectRatio={NaN}
              viewMode={2}
              autoCropArea={0.8}
              minContainerWidth={300}
              minContainerHeight={300}
              background={true}
              ready={() => console.log('Cropper listo')}
            />
          </div>

          <div className={styles.controls}>
            <button onClick={cropImage} className={styles.button}>
              Recortar imagen
            </button>
            <button onClick={() => rotate(-90)} className={styles.button}>
              Rotar izquierda
            </button>
            <button onClick={() => rotate(90)} className={styles.button}>
              Rotar derecha
            </button>
            <button onClick={reset} className={styles.button}>
              Reiniciar
            </button>
          </div>
        </div>
      )}

      {croppedImage && (
        <div className={styles.resultSection}>
          <h3>Resultado del recorte</h3>
          <div className={styles.croppedImageContainer}>
            <img src={croppedImage} alt="Imagen recortada" className={styles.croppedImage} />
          </div>
          <div className={styles.imageDetails}>
            <p><strong>Nombre de archivo:</strong> {croppedFileName}</p>
            <p><strong>Dimensiones:</strong> {croppedDimensions.width} × {croppedDimensions.height} píxeles</p>
            <p><strong>Tamaño de archivo:</strong> {formatFileSize(croppedFileSize)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FotosEditar;