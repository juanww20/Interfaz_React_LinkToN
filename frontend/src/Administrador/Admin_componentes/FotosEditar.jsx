import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import './cropper.css'
import Swal from 'sweetalert2';
import Icono_foto from '../../assets/foto.png';
import { imageService } from '../../services/project_4/multimediaService'; // ajusta la ruta según tu proyecto
import './FotosEditar.module.css'; // estilos adaptados desde tu Vue

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
  const triggerFileInput = () => fileInputRef.current.click();

  // Maneja el cambio de archivo seleccionado
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setCroppedImage('');

    const reader = new FileReader();
    reader.onload = (event) => setImageSrc(event.target.result);
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
    if (fileInputRef.current) fileInputRef.current.value = '';
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

    setCroppedDimensions({ width: canvas.width, height: canvas.height });

    canvas.toBlob((blob) => {
      if (!blob) return;
      setCroppedFileSize(blob.size);

      const reader = new FileReader();
      reader.onload = () => setCroppedImage(reader.result);
      reader.readAsDataURL(blob);
    }, selectedFile.type || 'image/png', 0.92);

    // Generar nombre recortado
    const fileName = selectedFile.name;
    const dotIndex = fileName.lastIndexOf('.');
    setCroppedFileName(dotIndex !== -1
      ? fileName.substring(0, dotIndex) + '_recortada' + fileName.substring(dotIndex)
      : fileName + '_recortada'
    );
  };

  // Rota la imagen
  const rotate = (degrees) => {
    if (cropperRef.current) cropperRef.current.cropper.rotate(degrees);
  };

  // Reinicia el cropper
  const reset = () => {
    if (cropperRef.current) cropperRef.current.cropper.reset();
  };

  // Formatea tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Subir imagen recortada
  const uploadCroppedImage = async () => {
    if (!croppedImage) return;
    const cropper = cropperRef.current.cropper;
    const canvas = cropper.getCroppedCanvas();
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], croppedFileName, { type: selectedFile.type || 'image/png' });
      const formData = new FormData();
      formData.append('image', file);

      try {
        Swal.fire({ title: 'Subiendo imagen...', text: 'Por favor espera', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        const response = await imageService.createImage(formData);

        Swal.fire({ icon: 'success', title: '¡Imagen subida!', text: 'La imagen se subió correctamente.', confirmButtonText: 'Aceptar' });
        console.log('✅ Imagen subida:', response.data);
      } catch (error) {
        console.error('❌ Error al subir imagen:', error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo subir la imagen. Intenta de nuevo.', confirmButtonText: 'Reintentar' });
      }
    }, selectedFile.type || 'image/png', 0.92);
  };

  return (
    <div className="image-uploader">
      <h2 className="centrar">Subir Imagen para editar la foto</h2>
      <div className="centrar">
        <img src={Icono_foto} alt="" style={{ width: '80px', height: 'auto' }} />
      </div>

      <div className="upload-section">
        <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        <button onClick={triggerFileInput}>Seleccionar Imagen</button>
        {imageSrc && <button onClick={clearImage} className="clear-btn">Borrar Foto</button>}

        {selectedFile && (
          <div className="file-info">
            Seleccionado: {selectedFile.name} ({formatFileSize(selectedFile.size)})
          </div>
        )}
      </div>

      {imageSrc && (
        <div className="cropper-section">
          <div className="cropper-container">
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

          <div className="controls">
            <button onClick={cropImage}>Recortar imagen</button>
            <button onClick={() => rotate(-90)}>Rotar izquierda</button>
            <button onClick={() => rotate(90)}>Rotar derecha</button>
            <button onClick={reset}>Reiniciar</button>
          </div>
        </div>
      )}

      {croppedImage && (
        <div className="result-section">
          <h3>Resultado del recorte</h3>
          <div className="cropped-image-container">
            <img src={croppedImage} alt="Imagen recortada" className="cropped-image" />
          </div>
          <div className="image-details">
            <p><strong>Nombre de archivo:</strong> {croppedFileName}</p>
            <p><strong>Dimensiones:</strong> {croppedDimensions.width} × {croppedDimensions.height} píxeles</p>
            <p><strong>Tamaño de archivo:</strong> {formatFileSize(croppedFileSize)}</p>
          </div>
          <button onClick={uploadCroppedImage} className="upload-btn">Subir Imagen Recortada</button>
        </div>
      )}
    </div>
  );
};

export default FotosEditar;
