import React, { useState, useEffect, useRef, useCallback } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import VideoExample from '../../temp/eu.mp4';
import AudioExample from '../../temp/0006.mp3';
import SubtituloExample from '../../temp/op.vtt';
import SubtituloExample2 from '../../temp/op1.vtt';
import './VideoCarousel.css';

// IMPORTACIONES PARA EL CARRUSEL (REACT-SLICK)
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const VideoCarousel = () => {
  // Estado para los videos
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Naturaleza en 4K',
      videoSrc: VideoExample,
      thumbnail: '',
      format: 'mp4',
      size: 1024 * 1024,
      duration: 60,
      audioTracks: [
        { label: 'Audio original', src: null },
        { label: 'Música relajante', src: AudioExample }
      ],
      subtitles: [
        { label: 'Español', lang: 'es', src: SubtituloExample },
        { label: 'Ingles', lang: 'in', src: SubtituloExample2 }
      ]
    },
    {
      id: 2,
      title: 'Ciudad al atardecer',
      videoSrc: VideoExample,
      thumbnail: '',
      format: 'mp4',
      size: 2.5 * 1024 * 1024,
      duration: 45,
      audioTracks: [
        { label: 'Audio original', src: null },
        { label: 'Sonidos urbanos', src: AudioExample }
      ],
      subtitles: [
        { label: 'Español', lang: 'es', src: SubtituloExample },
        { label: 'Ingles', lang: 'in', src: SubtituloExample2 }
      ]
    },
    {
      id: 3,
      title: 'Playas paradisíacas',
      videoSrc: VideoExample,
      thumbnail: '',
      format: 'mp4',
      size: 3.8 * 1024 * 1024,
      duration: 90,
      audioTracks: [
        { label: 'Audio original', src: null },
        { label: 'Olas del mar', src: AudioExample }
      ],
      subtitles: [{ label: 'Español', lang: 'es', src: SubtituloExample }]
    },
    {
      id: 4,
      title: 'Montañas nevadas',
      videoSrc: VideoExample,
      thumbnail: '',
      format: 'mp4',
      size: 4.2 * 1024 * 1024,
      duration: 75,
      audioTracks: [
        { label: 'Audio original', src: null },
        { label: 'Sonidos de viento', src: AudioExample }
      ],
      subtitles: [{ label: 'Español', lang: 'es', src: SubtituloExample }]
    }
  ]);

  // Estado del modal
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const [selectedAudioTrack, setSelectedAudioTrack] = useState(0);
  
  // Referencias
  const audioElementRef = useRef(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  
  // Configuración de React-Slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Función para generar miniaturas
  const generateVideoThumbnail = useCallback((videoSrc) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = videoSrc;
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        video.currentTime = 1;
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      video.onerror = (e) => {
        reject(`Error al cargar el video para generar la miniatura: ${e.message}`);
      };
    });
  }, []);

  // Inicializar Video.js
  const initVideoPlayer = useCallback(() => {
    if (!videoRef.current || !selectedVideo) return;
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }
    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      responsive: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      sources: [{
        src: selectedVideo.videoSrc,
        type: 'video/mp4'
      }],
      tracks: selectedVideo.subtitles.map((subtitle, index) => ({
        kind: 'subtitles',
        label: subtitle.label,
        srclang: subtitle.lang,
        src: subtitle.src,
        default: index === 0
      }))
    }, () => {
      const player = playerRef.current;
      player.on('loadedmetadata', () => {
        setVideoDimensions({
          width: player.videoWidth(),
          height: player.videoHeight()
        });
      });
      player.on('play', () => {
        if (audioElementRef.current) {
          audioElementRef.current.play().catch(e => console.error("Error al reproducir audio:", e));
        }
      });
      player.on('pause', () => {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
        }
      });
      player.on('seeked', () => {
        if (audioElementRef.current) {
          audioElementRef.current.currentTime = player.currentTime();
        }
      });
      player.on('ratechange', () => {
        if (audioElementRef.current) {
          audioElementRef.current.playbackRate = player.playbackRate();
        }
      });
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = `
        .video-js .vjs-text-track-cue div {
          color: var(--dark-color) !important;
          background-color: rgba(0, 0, 0, 0.5) !important;
          font-size: var(--text-font) !important;
          font-family: var(--font-secundaria) !important;
          font-weight: bold !important;
          text-shadow: 2px 0 2px black, -2px 0 2px black, 0 2px 2px black, 0 -2px 2px black !important;
        }
      `;
      document.head.appendChild(style);
    });
  }, [selectedVideo]);

  // Cambiar pista de audio
  const changeAudioTrack = useCallback(() => {
    if (!playerRef.current || !selectedVideo) return;
    const trackIndex = selectedAudioTrack;
    const player = playerRef.current;
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    if (trackIndex === 0) {
      player.volume(1);
    } else if (trackIndex < selectedVideo.audioTracks.length) {
      const track = selectedVideo.audioTracks[trackIndex];
      audioElementRef.current = new Audio(track.src);
      audioElementRef.current.currentTime = player.currentTime();
      audioElementRef.current.playbackRate = player.playbackRate();
      if (!player.paused()) {
        audioElementRef.current.play().catch(e => console.error("Error al iniciar audio:", e));
      }
      player.volume(0);
    }
  }, [selectedAudioTrack, selectedVideo]);

  // Funciones del modal
  const openModal = useCallback((video) => {
    setSelectedVideo(video);
    setSelectedAudioTrack(0);
  }, []);
  const closeModal = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    setSelectedVideo(null);
    setVideoDimensions({ width: 0, height: 0 });
  }, []);

  // Funciones de formato
  const formatFileSize = useCallback((bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);
  const formatDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Efecto para generar miniaturas al montar
  useEffect(() => {
    const generateThumbnails = async () => {
      try {
        const updatedVideos = await Promise.all(
          videos.map(async (video) => {
            if (!video.thumbnail) {
              const thumbnailUrl = await generateVideoThumbnail(video.videoSrc);
              return { ...video, thumbnail: thumbnailUrl };
            }
            return video;
          })
        );
        setVideos(updatedVideos);
      } catch (error) {
        console.error('Ocurrió un error al generar las portadas:', error);
      }
    };
    generateThumbnails();
    // FIX: Se elimina 'videos' del arreglo para evitar el bucle infinito
  }, [generateVideoThumbnail]);

  // Efecto para inicializar Video.js cuando se selecciona un video
  useEffect(() => {
    if (selectedVideo) {
      setTimeout(initVideoPlayer, 0);
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [selectedVideo, initVideoPlayer]);

  // Efecto para cambiar la pista de audio
  useEffect(() => {
    if (selectedVideo) {
      changeAudioTrack();
    }
  }, [selectedAudioTrack, selectedVideo, changeAudioTrack]);

  return (
    <div className="video-carousel-container">
      <header className="header">
        <h3>Carrusel de Videos con Subtítulos</h3>
      </header>
      
      <div className="carousel-container">
        <Slider {...sliderSettings}>
          {videos.map((video) => (
            <div key={video.id} className="carousel-slide">
              <div className="custom-slide" onClick={() => openModal(video)}>
                {video.thumbnail ? (
                  <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                ) : (
                  <div className="thumbnail-placeholder" style={{height: 180, backgroundColor: '#ccc'}}></div>
                )}
                <div className="video-title">
                  <h3 className="Cambio_subtitulo">{video.title}</h3>
                </div>
                {video.subtitles.length > 0 && (
                  <div className="video-subtitle-indicator">
                    <span className="subtitle-icon">CC</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
      
      {selectedVideo && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>&times;</button>
            <div className="modal-grid">
              <div className="video-container">
                <div className="video-wrapper">
                  <div data-vjs-player>
                    <video
                      ref={videoRef}
                      className="video-js vjs-big-play-centered"
                    />
                  </div>
                </div>
              </div>
              <div className="details-container">
                <h3 className="video-title Cambio_subtitulo2">{selectedVideo.title}</h3>
                <div className="detail-item">
                  <span className="detail-label">Nombre:</span>
                  <span className="detail-value">{selectedVideo.title}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tamaño:</span>
                  <span className="detail-value">{formatFileSize(selectedVideo.size)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Formato:</span>
                  <span className="detail-value">{selectedVideo.format}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Dimensiones:</span>
                  <span className="detail-value">{videoDimensions.width}px x {videoDimensions.height}px</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duración:</span>
                  <span className="detail-value">{formatDuration(selectedVideo.duration)}</span>
                </div>
                <div className="control-group">
                  <label htmlFor="audio-track">Pista de audio:</label>
                  <select 
                    id="audio-track" 
                    value={selectedAudioTrack}
                    onChange={(e) => setSelectedAudioTrack(parseInt(e.target.value))}
                  >
                    {selectedVideo.audioTracks.map((track, index) => (
                      <option key={index} value={index}>
                        {track.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;