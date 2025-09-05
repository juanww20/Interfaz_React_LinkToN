import React, { useState, useRef, useEffect, useCallback } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import styles from './VideosEditar.module.css';
import Swal from 'sweetalert2';
import { videoService, audioService, subtituloService } from '../../services/project_4/multimediaService'; // ajusta la ruta según tu proyecto

const VideoUploader = () => {
  const [videoData, setVideoData] = useState({
    name: '',
    file: null,
    audioFiles: [], // { file: File, language: string }
    subtitleFiles: [] // { file: File, language: string }
  });

  const videoPlayerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const audioElementRef = useRef(null);
  const syncListenersRef = useRef({ play: null, pause: null, seeking: null, timeupdate: null, ratechange: null });

  const [previewVideoSrc, setPreviewVideoSrc] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState(0);
  const [audioTracks, setAudioTracks] = useState([]);
  const [subtitles, setSubtitles] = useState([]);

  const getMediaDuration = useCallback((file) => {
    return new Promise((resolve) => {
      if (!(file instanceof File)) return resolve(0);
      const url = URL.createObjectURL(file);
      const media = file.type.includes('audio') ? new Audio() : document.createElement('video');
      media.src = url;
      media.onloadedmetadata = () => {
        resolve(media.duration);
        URL.revokeObjectURL(url);
      };
      media.onerror = () => { URL.revokeObjectURL(url); resolve(0); };
    });
  }, []);

  const getSubtitleDuration = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const lines = e.target.result.split('\n');
        let lastTime = 0;
        lines.forEach(line => {
          if (line.includes('-->')) {
            const endTime = line.split('-->')[1].trim().split(' ')[0];
            lastTime = Math.max(lastTime, convertVttTimeToSeconds(endTime));
          }
        });
        resolve(lastTime || 0);
      };
      reader.onerror = () => resolve(0);
      reader.readAsText(file);
    });
  }, []);

  const convertVttTimeToSeconds = (timeStr) => {
    const parts = timeStr.split(':');
    if (parts.length === 3) return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
    return 0;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.includes('mp4') || file.name.toLowerCase().endsWith('.mp4'))) {
      setVideoData(prev => ({ ...prev, file }));
    } else {
      alert('Por favor sube un archivo MP4 válido.');
      e.target.value = '';
    }
  };

  const handleAudioUpload = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.includes('audio'));
    const audioWithLang = files.map(f => ({ file: f, language: '' }));
    setVideoData(prev => ({ ...prev, audioFiles: [...prev.audioFiles, ...audioWithLang] }));
    e.target.value = '';
  };

  const handleSubtitleUpload = (e) => {
    const files = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.vtt'));
    const subsWithLang = files.map(f => ({ file: f, language: '' }));
    setVideoData(prev => ({ ...prev, subtitleFiles: [...prev.subtitleFiles, ...subsWithLang] }));
    e.target.value = '';
  };

  const removeAudio = (index) => setVideoData(prev => ({ ...prev, audioFiles: prev.audioFiles.filter((_, i) => i !== index) }));
  const removeSubtitle = (index) => setVideoData(prev => ({ ...prev, subtitleFiles: prev.subtitleFiles.filter((_, i) => i !== index) }));

  const updateAudioLang = (index, lang) => {
    setVideoData(prev => {
      const audioFiles = [...prev.audioFiles];
      audioFiles[index].language = lang;
      return { ...prev, audioFiles };
    });
  };

  const updateSubtitleLang = (index, lang) => {
    setVideoData(prev => {
      const subtitleFiles = [...prev.subtitleFiles];
      subtitleFiles[index].language = lang;
      return { ...prev, subtitleFiles };
    });
  };

  const generatePreview = async () => {
    if (!videoData.file) return;

    try {
      const videoDuration = await getMediaDuration(videoData.file);

      for (const audio of videoData.audioFiles) {
        if (Math.abs(await getMediaDuration(audio.file) - videoDuration) > 0.5)
          throw new Error(`El audio "${audio.file.name}" no coincide con la duración del video`);
      }

      
      for (const sub of videoData.subtitleFiles) {
        if (Math.abs(await getSubtitleDuration(sub.file) - videoDuration) > 0.5)
          throw new Error(`Los subtítulos "${sub.file.name}" no coinciden con la duración del video`);
      }
      
    } catch (err) {
      alert(err.message);
      return;
    }

    if (previewVideoSrc) URL.revokeObjectURL(previewVideoSrc);
    audioTracks.forEach(track => track.url && URL.revokeObjectURL(track.url));
    subtitles.forEach(sub => sub.url && URL.revokeObjectURL(sub.url));

    setPreviewVideoSrc(URL.createObjectURL(videoData.file));
    setAudioTracks([{ label: 'Audio original', url: null }, ...videoData.audioFiles.map(f => ({
      label: `${f.file.name} (${formatFileSize(f.file.size)})`,
      url: URL.createObjectURL(f.file),
      rawName: f.file.name.replace(/\.[^/.]+$/, '')
    }))]);
    setSubtitles(videoData.subtitleFiles.map(f => ({
      label: `${f.file.name.replace('.vtt','')} (${formatFileSize(f.file.size)})`,
      url: URL.createObjectURL(f.file),
      lang: f.language || 'es',
      rawName: f.file.name.replace('.vtt','')
    })));
    setSelectedAudioTrack(0);
    setShowPreview(true);
  };

  useEffect(() => {
    if (showPreview && previewVideoSrc && videoPlayerRef.current) {
      if (playerInstanceRef.current) playerInstanceRef.current.dispose();

      playerInstanceRef.current = videojs(videoPlayerRef.current, {
        controls: true,
        preload: 'auto',
        fluid: true,
        playbackRates: [0.5,1,1.5,2],
        sources: [{ src: previewVideoSrc, type: videoData.file?.type }],
        tracks: subtitles.map((sub, i) => ({
          kind: 'subtitles',
          src: sub.url,
          srclang: sub.lang,
          label: sub.rawName,
          default: i === 0
        }))
      });
    }
    return () => { playerInstanceRef.current?.dispose(); };
  }, [showPreview, previewVideoSrc, subtitles, videoData.file]);

  const changeAudioTrack = (e) => {
    const index = parseInt(e.target.value);
    setSelectedAudioTrack(index);

    if (!playerInstanceRef.current) return;
    const wasPlaying = !playerInstanceRef.current.paused();
    const currentTime = playerInstanceRef.current.currentTime();
    const playbackRate = playerInstanceRef.current.playbackRate();

    if (audioElementRef.current) { audioElementRef.current.pause(); audioElementRef.current = null; }
    syncListenersRef.current = { play:null, pause:null, seeking:null, timeupdate:null, ratechange:null };

    if (index === 0) {
      playerInstanceRef.current.volume(1);
      wasPlaying && playerInstanceRef.current.play().catch(console.error);
    } else {
      const track = audioTracks[index];
      const audioEl = new Audio(track.url);
      audioEl.currentTime = currentTime;
      audioEl.playbackRate = playbackRate;
      audioElementRef.current = audioEl;

      const onPlay = () => { if (audioEl.paused) { audioEl.currentTime = playerInstanceRef.current.currentTime(); audioEl.playbackRate = playerInstanceRef.current.playbackRate(); audioEl.play().catch(console.error); } };
      const onPause = () => !audioEl.paused && audioEl.pause();
      const onSeeking = () => audioEl.currentTime = playerInstanceRef.current.currentTime();
      const onTimeupdate = () => { if (Math.abs(audioEl.currentTime - playerInstanceRef.current.currentTime())>0.15) audioEl.currentTime = playerInstanceRef.current.currentTime(); };
      const onRatechange = () => audioEl.playbackRate = playerInstanceRef.current.playbackRate();

      playerInstanceRef.current.on('play', onPlay);
      playerInstanceRef.current.on('pause', onPause);
      playerInstanceRef.current.on('seeking', onSeeking);
      playerInstanceRef.current.on('timeupdate', onTimeupdate);
      playerInstanceRef.current.on('ratechange', onRatechange);

      syncListenersRef.current = { play:onPlay, pause:onPause, seeking:onSeeking, timeupdate:onTimeupdate, ratechange:onRatechange };
      playerInstanceRef.current.volume(0);
      wasPlaying && playerInstanceRef.current.play().then(() => audioEl.play().catch(console.error));
    }
  };

  const handleSubmit = async () => {
    let videoId = null;

    try {
      Swal.fire({
        title: "Subiendo...",
        text: "Por favor espera mientras se cargan los archivos",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // 1. Subir video principal
      console.log("video data:", videoData);
      const formDataVideo = new FormData();
      formDataVideo.append("video", videoData.file);

      const video = await videoService.createVideo(formDataVideo);
      videoId = video.data.video_id;

      if (!videoId) throw new Error("No se pudo obtener el ID del video subido");

      // 2. Subir audios
      for (const audio of videoData.audioFiles) {
        console.log("audio:", audio);
        const formDataAudio = new FormData();
        formDataAudio.append("audio", audio.file); // <-- accedemos al File real
        formDataAudio.append("idioma", audio.language);
        formDataAudio.append("video_id", String(videoId));

        await audioService.createAudio(formDataAudio);
      }

      // 3. Subir subtítulos
      for (const subtitle of videoData.subtitleFiles) {
        console.log("subtitulo:", subtitle);
        const formDataSubtitle = new FormData();
        formDataSubtitle.append("subtitulo", subtitle.file); // <-- accedemos al File real
        formDataSubtitle.append("idioma", subtitle.language);
        formDataSubtitle.append("video_id", String(videoId));

        await subtituloService.createSubtitulo(formDataSubtitle);
      }

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "El video, audios y subtítulos fueron subidos correctamente 🎉"
      });
    } catch (error) {
      // Si algo falla, eliminamos el video principal
      if (videoId) await videoService.deleteVideo(videoId);

      console.error("❌ Error al subir los archivos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Hubo un problema al subir los archivos"
      });
    }
  };

  useEffect(() => () => {
    playerInstanceRef.current?.dispose();
    if (previewVideoSrc) URL.revokeObjectURL(previewVideoSrc);
    audioTracks.forEach(track => track.url && URL.revokeObjectURL(track.url));
    subtitles.forEach(sub => sub.url && URL.revokeObjectURL(sub.url));
  }, [previewVideoSrc, audioTracks, subtitles]);

  return (
    <div className={styles.videoUploadContainer}>
      <div className={styles.uploadSection}>
        <h2>Subir y Configurar Video</h2>
        <form className={styles.uploadForm} onSubmit={(e)=>e.preventDefault()}>
          <div className={styles.formGroup}>
            <label>Archivo de video (MP4):</label>
            <input type="file" accept=".mp4" onChange={handleVideoUpload} required />
            {videoData.file && <div className={styles.fileInfo}>{videoData.file.name} ({formatFileSize(videoData.file.size)})</div>}
          </div>

          <div className={styles.formGroup}>
            <label>Pistas de audio adicionales:</label>
            <input type="file" accept="audio/*" multiple onChange={handleAudioUpload} />
            {videoData.audioFiles.length > 0 && (
              <div className={styles.fileList}>
                {videoData.audioFiles.map((f,i)=>(
                  <div key={i} className={styles.fileItem}>
                    <span>{f.file.name} ({formatFileSize(f.file.size)})</span>
                    <input type="text" placeholder="Idioma: es, en, fr" value={f.language} onChange={e=>updateAudioLang(i,e.target.value)} className={styles.langInput} />
                    <button type="button" onClick={()=>removeAudio(i)} className={styles.removeBtn}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Subtítulos (VTT, opcional):</label>
            <input type="file" accept=".vtt" multiple onChange={handleSubtitleUpload} />
            {videoData.subtitleFiles.length > 0 && (
              <div className={styles.fileList}>
                {videoData.subtitleFiles.map((f,i)=>(
                  <div key={i} className={styles.fileItem}>
                    <span>{f.file.name} ({formatFileSize(f.file.size)})</span>
                    <input type="text" placeholder="Idioma: es, en, fr" value={f.language} onChange={e=>updateSubtitleLang(i,e.target.value)} className={styles.langInput} />
                    <button type="button" onClick={()=>removeSubtitle(i)} className={styles.removeBtn}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="button" onClick={generatePreview} disabled={!videoData.file} className={styles.previewBtn}>Previsualizar Video</button>
        </form>
      </div>

      {showPreview && (
        <div className={styles.previewSection}>
          <h2>Previsualización</h2>
          <div className={styles.previewControls}>
            <div className={styles.controlGroup}>
              <label>Pista de audio:</label>
              <select value={selectedAudioTrack} onChange={changeAudioTrack}>
                {audioTracks.map((t,i)=><option key={i} value={i}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.videoWrapper}>
            <div data-vjs-player>
              <video ref={videoPlayerRef} className={`video-js vjs-big-play-centered ${styles.videoJs}`}></video>
            </div>
          </div>

          <button type="button" onClick={handleSubmit} className={styles.submitBtn}>Subir Video al Servidor</button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
