import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import styles from './LoaderConfig.module.css';

const LoaderConfig = () => {
  const [durationSeconds, setDurationSeconds] = useState(6);
  const [active, setActive] = useState(true);
  const [tangramSpeed, setTangramSpeed] = useState(400);

  // Load values from localStorage on mount
  useEffect(() => {
    const showLoader = localStorage.getItem('showLoader');
    const loaderTime = localStorage.getItem('loaderTime');
    const tangramSpeedStorage = localStorage.getItem('tangramSpeed');
    
    try {
      setActive(showLoader === null ? true : showLoader === 'true');
      // loaderTime is in ms, convert to seconds for input
      setDurationSeconds(loaderTime ? Math.round(JSON.parse(loaderTime) / 1000) : 6);
      setTangramSpeed(tangramSpeedStorage ? Number(tangramSpeedStorage) : 400);
    } catch {
      setDurationSeconds(6);
      setTangramSpeed(400);
    }
  }, []);

  const confirmSave = () => {
    Swal.fire({
      title: '¿Estás seguro de guardar la configuración?',
      text: `Duración: ${durationSeconds} segundos\nLoader: ${active ? 'Activado' : 'Desactivado'}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Save to localStorage (convert to ms)
        localStorage.setItem('showLoader', active);
        localStorage.setItem('loaderTime', durationSeconds * 1000);
        localStorage.setItem('tangramSpeed', tangramSpeed || 400); // Default value of 400ms
        Swal.fire('¡Guardado!', 'La configuración del loader ha sido guardada.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'No se guardó la configuración.', 'info');
      }
    });
  };

  return (
    <div className={styles.loaderConfig}>
      <div className={styles.formGroup}>
        <label htmlFor="loaderDuration">Duración de Loader (segundos):</label>
        <input
          id="loaderDuration"
          type="number"
          min="0"
          value={durationSeconds}
          onChange={(e) => setDurationSeconds(Number(e.target.value))}
          className={styles.inputNumber}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="loaderSpeed">Velocidad de Loader (ms):</label>
        <input
          id="loaderSpeed"
          type="range"
          min="200"
          max="900"
          step="10"
          value={tangramSpeed}
          onChange={(e) => setTangramSpeed(Number(e.target.value))}
          className={styles.inputRange}
        />
        <span className={styles.rangeValue}>{tangramSpeed} ms</span>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="loaderActive">Activar Loader:</label>
        <input
          id="loaderActive"
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className={styles.inputSwitch}
        />
      </div>
      <button className={styles.saveBtn} onClick={confirmSave}>
        Guardar Configuración
      </button>
    </div>
  );
};

export default LoaderConfig;