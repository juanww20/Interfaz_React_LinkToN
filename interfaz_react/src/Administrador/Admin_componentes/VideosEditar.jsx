import React, { useState, useRef, useEffect, useCallback } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import styles from './VideosEditar.module.css';

const VideoUploader = () => {
  const [videoData, setVideoData] = useState({
    name: '',
    file: null,
    audioFiles: [],
    subtitleFiles: []
  });

  const videoPlayerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const audioElementRef = useRef(null);

  const [previewVideoSrc, setPreviewVideoSrc] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState(0);
  const [audioTracks, setAudioTracks] = useState([]);
  const [subtitles, setSubtitles] = useState([]);
  const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);

  const syncListenersRef = useRef({
    play: null,
    pause: null,
    seeking: null,
    timeupdate: null,
    ratechange: null
  });

  // Refs para el cleanup
  const audioTracksRef = useRef(audioTracks);
  const subtitlesRef = useRef(subtitles);
  const previewVideoSrcRef = useRef(previewVideoSrc);

  // Sincronizar refs con state
  useEffect(() => {
    audioTracksRef.current = audioTracks;
  }, [audioTracks]);

  useEffect(() => {
    subtitlesRef.current = subtitles;
  }, [subtitles]);

  useEffect(() => {
    previewVideoSrcRef.current = previewVideoSrc;
  }, [previewVideoSrc]);

  // Función para obtener duración de medios
  const getMediaDuration = useCallback((file) => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const media = file.type.includes('audio') ? new Audio() : document.createElement('video');
      
      media.src = url;
      media.onloadedmetadata = () => {
        resolve(media.duration);
        URL.revokeObjectURL(url);
      };
      
      media.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(0);
      };
    });
  }, []);

  // Función para estimar duración de subtítulos VTT
  const getSubtitleDuration = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const vttContent = e.target.result;
        const lines = vttContent.split('\n');
        let lastTime = 0;
        
        for (const line of lines) {
          if (line.includes('-->')) {
            const parts = line.split('-->')[1].trim().split(' ');
            const endTime = parts[0];
            const seconds = convertVttTimeToSeconds(endTime);
            lastTime = Math.max(lastTime, seconds);
          }
        }
        
        resolve(lastTime || 0);
      };
      reader.onerror = () => resolve(0);
      reader.readAsText(file);
    });
  }, []);

  // Convertir formato VTT a segundos
  const convertVttTimeToSeconds = useCallback((timeStr) => {
    const parts = timeStr.split(':');
    if (parts.length === 3) {
      const hours = parseFloat(parts[0]);
      const minutes = parseFloat(parts[1]);
      const seconds = parseFloat(parts[2]);
      return (hours * 3600) + (minutes * 60) + seconds;
    }
    return 0;
  }, []);

  // Maneja la selección del archivo de video
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type.includes('mp4') || file.name.toLowerCase().endsWith('.mp4'))) {
      setVideoData(prev => ({ ...prev, file }));
    } else {
      alert('Por favor, sube un archivo MP4 válido.');
      event.target.value = '';
    }
  };

  // Maneja la subida de múltiples audios
  const handleAudioUpload = (event) => {
    const files = Array.from(event.target.files);
    const audioFiles = files.filter(file => file.type.includes('audio'));
    setVideoData(prev => ({
      ...prev,
      audioFiles: [...prev.audioFiles, ...audioFiles]
    }));
    event.target.value = '';
  };

  // Elimina un audio de la lista
  const removeAudio = (index) => {
    setVideoData(prev => ({
      ...prev,
      audioFiles: prev.audioFiles.filter((_, i) => i !== index)
    }));
  };

  // Maneja la subida de múltiples subtítulos
  const handleSubtitleUpload = (event) => {
    const files = Array.from(event.target.files);
    const subtitleFiles = files.filter(file => file.name.toLowerCase().endsWith('.vtt'));
    setVideoData(prev => ({
      ...prev,
      subtitleFiles: [...prev.subtitleFiles, ...subtitleFiles]
    }));
    event.target.value = '';
  };

  // Elimina un subtítulo de la lista
  const removeSubtitle = (index) => {
    setVideoData(prev => ({
      ...prev,
      subtitleFiles: prev.subtitleFiles.filter((_, i) => i !== index)
    }));
  };

  // Prepara los datos y muestra la sección de previsualización
  const generatePreview = async () => {
    if (!videoData.file) return;

    // Validación de duración
    try {
      const videoDuration = await getMediaDuration(videoData.file);
      
      // Verificar audios
      for (const audioFile of videoData.audioFiles) {
        const audioDuration = await getMediaDuration(audioFile);
        if (Math.abs(audioDuration - videoDuration) > 0.5) {
          throw new Error(`El audio "${audioFile.name}" no coincide con la duración del video`);
        }
      }
      
      // Verificar subtítulos
      for (const subFile of videoData.subtitleFiles) {
        const subDuration = await getSubtitleDuration(subFile);
        if (Math.abs(subDuration - videoDuration) > 0.5) {
          throw new Error(`Los subtítulos "${subFile.name}" no coinciden con la duración del video`);
        }
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      return;
    }

    // Limpiar URLs previas
    if (previewVideoSrcRef.current) {
      URL.revokeObjectURL(previewVideoSrcRef.current);
    }
    audioTracksRef.current.forEach(track => {
      if (track.url) URL.revokeObjectURL(track.url);
    });
    subtitlesRef.current.forEach(sub => {
      if (sub.url) URL.revokeObjectURL(sub.url);
    });

    // Crear URLs para los archivos
    const videoUrl = URL.createObjectURL(videoData.file);
    
    const newAudioTracks = [{ label: 'Audio original', url: null }];
    videoData.audioFiles.forEach(file => {
      newAudioTracks.push({
        label: `${file.name.replace(/\.[^/.]+$/, "")} (${formatFileSize(file.size)})`,
        url: URL.createObjectURL(file),
        rawName: file.name.replace(/\.[^/.]+$/, "")
      });
    });

    const newSubtitles = videoData.subtitleFiles.map(file => ({
      label: `${file.name.replace('.vtt', '').replace(/_/g, ' ')} (${formatFileSize(file.size)})`,
      url: URL.createObjectURL(file),
      lang: 'es',
      rawName: file.name.replace('.vtt', '').replace(/_/g, ' ')
    }));

    setPreviewVideoSrc(videoUrl);
    setAudioTracks(newAudioTracks);
    setSubtitles(newSubtitles);
    setShowPreview(true);
    setSelectedAudioTrack(0);
    setIsPlayerInitialized(false);
  };

  // Inicializar el reproductor cuando el elemento video esté disponible
  useEffect(() => {
    if (showPreview && previewVideoSrc && videoPlayerRef.current && !isPlayerInitialized) {
      // Limpiar instancia previa
      if (playerInstanceRef.current) {
        playerInstanceRef.current.dispose();
        playerInstanceRef.current = null;
      }

      // Pequeño delay para asegurar que el DOM esté listo
      const initPlayer = setTimeout(() => {
        try {
          const player = videojs(videoPlayerRef.current, {
            controls: true,
            autoplay: false,
            preload: 'auto',
            responsive: true,
            fluid: true,
            playbackRates: [0.5, 1, 1.5, 2],
            sources: [{
              src: previewVideoSrc,
              type: videoData.file.type
            }],
            tracks: subtitles.map((sub, index) => ({
              kind: 'subtitles',
              src: sub.url,
              srclang: sub.lang,
              label: sub.rawName,
              default: index === 0
            }))
          }, () => {
            console.log('Reproductor listo!');
            const subsButton = player.controlBar.subsCapsButton;
            if (subsButton) {
              subsButton.controlText('Subtítulos');
            }
          });

          player.on('error', () => {
            console.error('Error del reproductor:', player.error());
          });

          playerInstanceRef.current = player;
          setIsPlayerInitialized(true);
        } catch (error) {
          console.error('Error al inicializar Video.js:', error);
        }
      }, 100);

      return () => clearTimeout(initPlayer);
    }
  }, [showPreview, previewVideoSrc, subtitles, videoData.file, isPlayerInitialized]);

  // Elimina los event listeners de sincronización
  const removeSyncListeners = useCallback(() => {
    if (!playerInstanceRef.current) return;
    
    const listeners = syncListenersRef.current;
    Object.keys(listeners).forEach(event => {
      if (listeners[event]) {
        playerInstanceRef.current.off(event, listeners[event]);
        listeners[event] = null;
      }
    });
  }, []);

  // Cambia la pista de audio activa
  const changeAudioTrack = (event) => {
    const trackIndex = parseInt(event.target.value);
    setSelectedAudioTrack(trackIndex);
    
    if (!playerInstanceRef.current) return;
    
    const wasPlaying = !playerInstanceRef.current.paused();
    const currentTime = playerInstanceRef.current.currentTime();
    const playbackRate = playerInstanceRef.current.playbackRate();
    
    if (trackIndex !== 0 && audioElementRef.current) {
      playerInstanceRef.current.pause();
    }
    
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    
    removeSyncListeners();
    
    if (trackIndex === 0) {
      playerInstanceRef.current.volume(1);
      if (wasPlaying) {
        playerInstanceRef.current.play().catch(e => console.error("Error al reanudar:", e));
      }
    } else if (trackIndex > 0 && trackIndex < audioTracks.length) {
      const track = audioTracks[trackIndex];
      const audioElement = new Audio(track.url);
      audioElement.currentTime = currentTime;
      audioElement.playbackRate = playbackRate;
      audioElementRef.current = audioElement;
      
      const onPlay = () => {
        if (audioElement.paused) {
          audioElement.currentTime = playerInstanceRef.current.currentTime();
          audioElement.playbackRate = playerInstanceRef.current.playbackRate();
          audioElement.play().catch(e => console.error("Error audio externo:", e));
        }
      };
      
      const onPause = () => !audioElement.paused && audioElement.pause();
      const onSeeking = () => audioElement.currentTime = playerInstanceRef.current.currentTime();
      
      const onTimeupdate = () => {
        if (Math.abs(audioElement.currentTime - playerInstanceRef.current.currentTime()) > 0.15) {
          audioElement.currentTime = playerInstanceRef.current.currentTime();
        }
      };
      
      const onRatechange = () => audioElement.playbackRate = playerInstanceRef.current.playbackRate();
      
      playerInstanceRef.current.on('play', onPlay);
      playerInstanceRef.current.on('pause', onPause);
      playerInstanceRef.current.on('seeking', onSeeking);
      playerInstanceRef.current.on('timeupdate', onTimeupdate);
      playerInstanceRef.current.on('ratechange', onRatechange);
      
      syncListenersRef.current = { play: onPlay, pause: onPause, seeking: onSeeking, timeupdate: onTimeupdate, ratechange: onRatechange };
      
      playerInstanceRef.current.volume(0);
      
      if (wasPlaying) {
        playerInstanceRef.current.play().then(() => {
          audioElement.play().catch(e => console.error("Error al iniciar audio externo:", e));
        });
      }
    }
  };

  // Formatea el tamaño del archivo
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Maneja el envío final del formulario
  const handleSubmit = () => {
    console.log('Datos del video a subir:', {
      name: videoData.name,
      video: videoData.file,
      audioFiles: videoData.audioFiles,
      subtitleFiles: videoData.subtitleFiles
    });
    alert('Video listo para ser subido. Revisa la consola para ver los datos.');
  };

  // Limpia recursos al desmontar el componente
  useEffect(() => {
    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.dispose();
      }
      if (previewVideoSrcRef.current) {
        URL.revokeObjectURL(previewVideoSrcRef.current);
      }
      audioTracksRef.current.forEach(track => {
        if (track.url) URL.revokeObjectURL(track.url);
      });
      subtitlesRef.current.forEach(sub => {
        if (sub.url) URL.revokeObjectURL(sub.url);
      });
      removeSyncListeners();
    };
  }, [removeSyncListeners]);

  return (
    <div className={styles.videoUploadContainer}>
      <div className={styles.uploadSection}>
        <h2>Subir Video</h2>
        <form onSubmit={(e) => e.preventDefault()} className={styles.uploadForm}>
          <div className={styles.formGroup}>
            <label htmlFor="video-name">Nombre del video:</label>
            <input
              id="video-name"
              value={videoData.name}
              onChange={(e) => setVideoData(prev => ({ ...prev, name: e.target.value }))}
              type="text"
              required
              placeholder="Ej: Mi video increíble"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="video-file">Archivo de video (MP4):</label>
            <input
              id="video-file"
              type="file"
              accept=".mp4"
              required
              onChange={handleVideoUpload}
            />
            {videoData.file && (
              <div className={styles.fileInfo}>
                Archivo seleccionado: {videoData.file.name} ({formatFileSize(videoData.file.size)})
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="audio-file">Pistas de audio adicionales (opcional):</label>
            <input
              id="audio-file"
              type="file"
              accept="audio/*"
              multiple
              onChange={handleAudioUpload}
            />
            {videoData.audioFiles.length > 0 && (
              <div className={styles.fileList}>
                {videoData.audioFiles.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <span>{file.name} ({formatFileSize(file.size)})</span>
                    <button
                      onClick={() => removeAudio(index)}
                      className={styles.removeBtn}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subtitle-file">Archivos de subtítulos (VTT, opcional):</label>
            <input
              id="subtitle-file"
              type="file"
              accept=".vtt"
              multiple
              onChange={handleSubtitleUpload}
            />
            {videoData.subtitleFiles.length > 0 && (
              <div className={styles.fileList}>
                {videoData.subtitleFiles.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <span>{file.name} ({formatFileSize(file.size)})</span>
                    <button
                      onClick={() => removeSubtitle(index)}
                      className={styles.removeBtn}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={generatePreview}
            disabled={!videoData.file}
            className={styles.previewBtn}
          >
            Previsualizar Video
          </button>
        </form>
      </div>

      {showPreview && (
        <div className={styles.previewSection}>
          <h2>Previsualización</h2>
          
          <div className={styles.previewControls}>
            <div className={styles.controlGroup}>
              <label>Pista de audio:</label>
              <select
                value={selectedAudioTrack}
                onChange={changeAudioTrack}
              >
                {audioTracks.map((track, index) => (
                  <option key={index} value={index}>
                    {track.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className={styles.videoWrapper}>
            <div data-vjs-player>
              <video
                ref={videoPlayerRef}
                className={`video-js vjs-big-play-centered ${styles.videoJs}`}
              />
            </div>
          </div>
          
          <button onClick={handleSubmit} className={styles.submitBtn}>
            Subir Video al Servidor
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;