import React, { useState, useEffect, useRef, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Slider from "react-slick";
import Swal from "sweetalert2";
import { videoService } from "../../services/project_4/multimediaService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./VideoCarousel.css";

const VideoCarousel = ({ showDelete = false, isAdmin = false }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const [selectedAudioTrack, setSelectedAudioTrack] = useState(0);

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const audioRef = useRef(null);

  // Miniaturas
  const generateVideoThumbnail = useCallback((videoSrc) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = videoSrc;
      video.crossOrigin = "anonymous";
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        video.currentTime = 1;
      };
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      video.onerror = (e) => {
        reject(`Error al cargar el video: ${e.message}`);
      };
    });
  }, []);

  // Fetch inicial
  const fetchVideos = async () => {
    try {
      const res = await videoService.getVideos();
      if (res?.data) {
        const withThumbnails = await Promise.all(
          res.data.map(async (video) => {
            if (!video.thumbnail) {
              const thumbnailUrl = await generateVideoThumbnail(video.path);
              return { ...video, thumbnail: thumbnailUrl };
            }
            return video;
          })
        );
        setVideos(withThumbnails);
      }
    } catch (err) {
      console.error("Error al obtener videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Confirmación de borrado
  const confirmDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar video?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        await videoService.deleteVideo(id);
        await fetchVideos();
        Swal.fire("Eliminado", "El video ha sido eliminado", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el video", error);
      }
    }
  };

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
      preload: "auto",
      responsive: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      sources: [
        {
          src: selectedVideo.path,
          type: selectedVideo.formato || "video/mp4",
        },
      ],
      tracks: (selectedVideo.subtitulos || []).map((subtitle, index) => ({
        kind: "subtitles",
        label: subtitle.idioma,
        srclang: subtitle.idioma,
        src: subtitle.path,
        default: index === 0,
      })),
    });

    playerRef.current.on("loadedmetadata", () => {
      setVideoDimensions({
        width: playerRef.current.videoWidth(),
        height: playerRef.current.videoHeight(),
      });
    });

    // Estilos para subtítulos
    const style = document.createElement("style");
    style.innerHTML = `
      .video-js .vjs-text-track-cue div {
        color: var(--dark-color) !important;
        background-color: rgba(0, 0, 0, 0.5) !important;
        font-size: var(--text-font) !important;
        font-family: var(--font-secundaria) !important;
        font-weight: bold !important;
        text-shadow: 
          2px 0 2px black,
          -2px 0 2px black,
          0 2px 2px black,
          0 -2px 2px black !important;
      }
    `;
    document.head.appendChild(style);

    changeAudioTrack();
  }, [selectedVideo]);

  // Cambiar pista de audio
  const changeAudioTrack = useCallback(() => {
    if (!playerRef.current || !selectedVideo) return;

    const trackIndex = selectedAudioTrack;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (trackIndex === 0) {
      playerRef.current.volume(1);
    } else if (trackIndex < selectedVideo.audios?.length) {
      const track = selectedVideo.audios[trackIndex];
      const wasPlaying = !playerRef.current.paused();
      const currentTime = playerRef.current.currentTime();
      const playbackRate = playerRef.current.playbackRate();

      playerRef.current.pause();

      audioRef.current = new Audio(track.path);
      audioRef.current.currentTime = currentTime;
      audioRef.current.playbackRate = playbackRate;

      playerRef.current.on("play", () => {
        audioRef.current.currentTime = playerRef.current.currentTime();
        audioRef.current.playbackRate = playerRef.current.playbackRate();
        audioRef.current.play().catch((e) => console.error("Error audio:", e));
      });

      playerRef.current.on("pause", () => {
        audioRef.current.pause();
      });

      playerRef.current.on("seeking", () => {
        audioRef.current.currentTime = playerRef.current.currentTime();
      });

      playerRef.current.on("ratechange", () => {
        audioRef.current.playbackRate = playerRef.current.playbackRate();
      });

      playerRef.current.volume(0);

      if (wasPlaying) {
        playerRef.current.play().then(() => {
          audioRef.current.play().catch((e) => console.error("Error audio:", e));
        });
      }
    }
  }, [selectedAudioTrack, selectedVideo]);

  useEffect(() => {
    if (selectedVideo) {
      initVideoPlayer();
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [selectedVideo, initVideoPlayer]);

  useEffect(() => {
    if (selectedVideo) {
      changeAudioTrack();
    }
  }, [selectedAudioTrack]);

  // Abrir y cerrar modal
  const openModal = (video) => {
    setSelectedVideo(video);
    setSelectedAudioTrack(0);
  };

  const closeModal = () => {
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSelectedVideo(null);
    setVideoDimensions({ width: 0, height: 0 });
  };

  // Helpers de formato
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Configuración carrusel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 700, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="video-carousel-container">
      <header className="header">
        <h3>Carrusel de Videos con Subtítulos</h3>
      </header>

      <Slider {...sliderSettings}>
        {videos.map((video) => (
          <div key={video.video_id} className="carousel-slide">
            <div className="custom-slide" onClick={() => openModal(video)}>
              {video.thumbnail ? (
                <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
              ) : (
                <div className="thumbnail-placeholder" style={{ height: 180, backgroundColor: "#ccc" }}></div>
              )}
              <div className="video-title">
                <h3 className="Cambio_subtitulo">{video.title}</h3>
              </div>
              {video.subtitulos?.length > 0 && (
                <div className="video-subtitle-indicator">
                  <span className="subtitle-icon">CC</span>
                </div>
              )}
              {isAdmin && showDelete && (
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(video.video_id);
                  }}
                >
                  🗑 Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </Slider>

      {selectedVideo && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <div className="modal-grid">
              <div className="video-container">
                <div className="video-wrapper">
                  <div data-vjs-player>
                    <video ref={videoRef} className="video-js vjs-big-play-centered" />
                  </div>
                </div>
              </div>
              <div className="details-container">
                <h3 className="video-title Cambio_subtitulo2">{selectedVideo.title}</h3>
                <div className="detail-item">
                  <span className="detail-label">Nombre:</span>
                  <span className="detail-value">{selectedVideo.nombre}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tamaño:</span>
                  <span className="detail-value">{formatFileSize(selectedVideo.size)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Formato:</span>
                  <span className="detail-value">{selectedVideo.formato}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Dimensiones:</span>
                  <span className="detail-value">
                    {videoDimensions.width}px x {videoDimensions.height}px
                  </span>
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
                    {(selectedVideo.audios || []).map((track, index) => (
                      <option key={index} value={index}>
                        {track.idioma}
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
