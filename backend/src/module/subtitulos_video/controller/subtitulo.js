import { ModelSubtitulo } from "../model/subtitulo.js";
import path from "path";
import fs from "fs";
import { UPLOADS_DIR } from "../../../utils/global-path.js"
import { validateAudio, validateAudioUpdate } from "../../../helper/validation.js";
import { getSubtitleMetadata } from "../../../utils/subtitle_metadata.js"

const __dirname = UPLOADS_DIR;

export class ControllerSubtitulo {

    static async create(req, res) {

        const file = req.file;
        const result = validateAudio(req.body);

        if (!result.success) return res.status(422).json({ message: result.error.errors[0].message });
        if (!file) return res.status(400).json({ message: "File is required" });

        try {

            // obtener los datos del archivo de subtitulo
            const filePath = path.join(file.destination, file.filename);
            const metadata = getSubtitleMetadata(filePath);
            if (!metadata) return res.status(400).json({ message: "Invalid subtitle file" });

            const data = {
                idioma: result.data.idioma,
                formato: file.mimetype,
                duration: metadata.duration,
                size: file.size,
                video_id: result.data.video_id,
                path: file.filename
            };

            console.log("data to save:", data);
            const response = await ModelSubtitulo.create(data);
            return res.status(response.status).json({ message: response.message, subtitle: response.data });
        } catch (error) {
            console.error("Error in create subtitle controller:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getAll(req, res) {
        try {
            const response = await ModelSubtitulo.getAll();

            if (response.status === 404) return res.status(response.status).json({ message: response.message });

            const data = response.data.map(subtitle => {
                return {
                    id: subtitle.subtitulo_id,
                    idioma: subtitle.idioma,
                    formato: subtitle.formato,
                    duration: subtitle.duration,
                    size: subtitle.size,
                    video_id: subtitle.video_id,
                    path: `${req.protocol}://${req.get('host')}/subtitulos/${subtitle.path}`
                };
            });

            return res.status(response.status).json({ message: response.message, subtitles: data });
        } catch (error) {
            console.error("Error in get all subtitles controller:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getById(req, res) {
        const id = req.params.id;

        try {
            const response = await ModelSubtitulo.getById(id);

            if (response.status === 404) return res.status(response.status).json({ message: response.message });

            const data = {
                id: response.data.subtitulo_id,
                idioma: response.data.idioma,
                formato: response.data.formato,
                duration: response.data.duration,
                size: response.data.size,
                video_id: response.data.video_id,
                path: `${req.protocol}://${req.get('host')}/subtitulos/${response.data.path}`
            };

            return res.status(response.status).json({ message: response.message, subtitle: data });
        } catch (error) {
            console.error("Error in get subtitle by ID controller:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async update(req, res) {
        const id = req.params.id;
        const file = req.file;
        const result = validateAudioUpdate(req.body);

        if(!id) return res.status(400).json({ message: "ID is required" });
        if (!result.success) return res.status(422).json({ message: result.error.errors[0].message });
        if (!file) return res.status(400).json({ message: "File is required" });

        try {

            // obtener la pista de subtitulo anterior
            const existingSubtitle = await ModelSubtitulo.getById(id);
            if (existingSubtitle.status === 404) return res.status(existingSubtitle.status).json({ message: existingSubtitle.message });

            // eliminar el archivo anterior
            const oldFilePath = path.join(__dirname, 'uploads', 'subtitulos', existingSubtitle.data.path);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

            // obtener los datos del archivo de subtitulo
            const filePath = path.join(file.destination, file.filename);
            const metadata = getSubtitleMetadata(filePath);
            if (!metadata) return res.status(400).json({ message: "Invalid subtitle file" });

            const data = {
                idioma: result.data.idioma,
                formato: file.mimetype,
                duration: metadata.duration,
                size: file.size,
                video_id: result.data.video_id,
                path: file.filename
            };

            console.log("data to save:", data);
            const response = await ModelSubtitulo.update(id, data);
            return res.status(response.status).json({ message: response.message, subtitle: response.data });
        } catch (error) {
            console.error("Error in update subtitle controller:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async delete(req, res) {
        const id = req.params.id;

        if (!id) return res.status(400).json({ message: "ID is required" });

        try {
            const existingSubtitle = await ModelSubtitulo.getById(id);
            if (existingSubtitle.status === 404) return res.status(existingSubtitle.status).json({ message: existingSubtitle.message });

            // eliminar el archivo de subtitulo
            const filePath = path.join(__dirname, 'uploads', 'subtitulos', existingSubtitle.data.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            const response = await ModelSubtitulo.delete(id);
            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            console.error("Error in delete subtitle controller:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}