import { ModelVideo } from "../model/video.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";
import path from "path";
import fs from 'fs';
import { UPLOADS_DIR } from "../../../utils/global-path.js";

const __dirname = UPLOADS_DIR;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

export class ControllerVideo {

    static async createVideo(req, res) {

        const file = req.file;

        if (!file) return res.status(400).json({ message: "No file uploaded" });

        try {

            // obtener datos del video

            const duration = await new Promise((resolve, reject) => {
                ffmpeg.ffprobe(file.path, (err, metadata) => {
                    if (err) return reject(err);
                    resolve(metadata.format.duration);
                });
            });
            if (!duration) return res.status(400).json({ message: "Could not retrieve video duration" });

            const videoData = {
                nombre: file.originalname,
                formato: file.mimetype,
                duration: duration,
                size: file.size,
                path: file.filename,
            };

            console.log("Video data to be saved:", videoData);

            const result = await ModelVideo.create(videoData);
            return res.status(result.status).json({ message: result.message, data: result.data });

        } catch (error) {
            console.error("Error in createVideo controller:", error);
            return res.status(500).json({ message: "Internal server error" });
            
        }
    }

    static async getAllVideos(req, res) {

        try {

            const result = await ModelVideo.getAll();

            if (result.status === 404) return res.status(result.status).json({ message: result.message });

            const formattedVideos = result.data.map(video => {
                const v = video.toJSON(); // convierte a objeto plano

                // cambiar solo el path del video
                v.path = `${req.protocol}://${req.get('host')}/videos/${v.path}`;

                // si hay audios, ajustar path
                if (v.audios) {
                    v.audios = v.audios.map(audio => ({
                        ...audio,
                        path: `${req.protocol}://${req.get('host')}/audios/${audio.path}`
                    }));
                }

                // si hay subtitulos, ajustar path
                if (v.subtitulos) {
                    v.subtitulos = v.subtitulos.map(sub => ({
                        ...sub,
                        path: `${req.protocol}://${req.get('host')}/subtitulos/${sub.path}`
                    }));
                }

                return v;
            });

            return res.status(result.status).json({ message: result.message, data: formattedVideos });

        } catch (error) {
            console.error("Error in getAllVideos controller:", error);
            return res.status(500).json({ message: "Internal server error" });
            
        }
    }

    static async getVideoById(req, res) {

        const { id } = req.params;

        if (!id) return res.status(400).json({ message: "Video ID is required" });

        try {

            const result = await ModelVideo.getById(id);

            if (result.status === 404) return res.status(result.status).json({ message: result.message });

            const formattedVideo = {
                video_id: result.data.video_id,
                name: result.data.nombre,
                format: result.data.formato,
                size: result.data.size,
                duration: result.data.duration,
                path: `${req.protocol}://${req.get('host')}/videos/${result.data.path}`,
            };

            return res.status(result.status).json({ message: result.message, data: formattedVideo });

        } catch (error) {
            console.error("Error in getVideoById controller:", error);
            return res.status(500).json({ message: "Internal server error" });
            
        }
    }

    static async updateVideo(req, res) {
        const { id } = req.params;
        const file = req.file;

        if (!id) return res.status(400).json({ message: "Video ID is required" });
        if (!file) return res.status(400).json({ message: "No file uploaded" });

        try {

            // borrar el video anterior si existe
            const existingVideo = await ModelVideo.getById(id);
            if (existingVideo.status === 404) return res.status(existingVideo.status).json({ message: existingVideo.message });

            // borrar el archivo del sistema de archivos
            const previousPath = path.join(__dirname, 'uploads', 'videos', existingVideo.data.path);
            if (fs.existsSync(previousPath)) {
                console.log('Deleting previous video file:', previousPath);
                fs.unlinkSync(previousPath);
            }

            // obtener nuevos datos del video
            const duration = await new Promise((resolve, reject) => {
                ffmpeg.ffprobe(file.path, (err, metadata) => {
                    if (err) return reject(err);
                    resolve(metadata.format.duration);
                });
            });
            if (!duration) return res.status(400).json({ message: "Could not retrieve video duration" });

            const videoData = {
                nombre: file.originalname,
                formato: file.mimetype,
                duration: duration,
                size: file.size,
                path: file.filename,
            };

            const response = await ModelVideo.update(id, videoData);
            return res.status(response.status).json({ message: response.message, data: response.data });

        } catch (error) {
            console.error("Error in updateVideo controller:", error);
            return res.status(500).json({ message: "Internal server error" });
            
        }
    }

    static async deleteVideo(req, res) {

        const { id } = req.params;

        if (!id) return res.status(400).json({ message: "Video ID is required" });

        try {

            // obtener el video a eliminar
            const existingVideo = await ModelVideo.getById(id);
            if (existingVideo.status === 404) return res.status(existingVideo.status).json({ message: existingVideo.message });

            // borrar el archivo del sistema de archivos
            const previousPath = path.join(__dirname, 'uploads', 'videos', existingVideo.data.path);
            if (fs.existsSync(previousPath)) {
                console.log('Deleting video file:', previousPath);
                fs.unlinkSync(previousPath);
            }

            const response = await ModelVideo.delete(id);
            return res.status(response.status).json({ message: response.message, data: response.data });

        } catch (error) {
            console.error("Error in deleteVideo controller:", error);
            return res.status(500).json({ message: "Internal server error" });
            
        }
    }
}