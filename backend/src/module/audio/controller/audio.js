import { ModelAudio } from "../model/audio.js";
import { validateAudio, validateAudioUpdate } from "../../../helper/validation.js"
import { parseFile } from "music-metadata"
import path from "path";
import fs from 'fs';
import { UPLOADS_DIR } from "../../../utils/global-path.js";

const __dirname = UPLOADS_DIR;

export class ControllerAudio {

    static createAudio = async (req, res) => {

        const file = req.file;
        const result = validateAudio(req.body);

        if (!result.success) return res.status(422).json({ message: result.error.errors[0].message });

        if (!file) return res.status(400).json({ message: "No file uploaded" });

        try {

            const filePath = path.resolve(req.file.path);
            const metadata = await parseFile(filePath);
            
            // obtener los datos del archivo de audio
            const data = {
                idioma: result.data.idioma,
                formato: file.mimetype,
                duration: metadata.format.duration,
                size: file.size,
                video_id: result.data.video_id,
                path: file.filename
            };

            console.log("Data to save:", data);
            const response = await ModelAudio.create(data);
            return res.status(response.status).json({message: response.message, audio: response.audio});
        } catch (error) {
            console.error("Error in createAudio controller:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static getAllAudios = async (req, res) => {
        try {
            const response = await ModelAudio.getAll();

            if (response.status === 404) return res.status(response.status).json({ message: response.message });

            const audios = response.audios.map(audio => ({
                id: audio.audio_id,
                idioma: audio.idioma,
                formato: audio.formato,
                duration: audio.duration,
                size: audio.size,
                video_id: audio.video_id,
                path: `${req.protocol}://${req.get('host')}/audios/${audio.path}`,
            }));

            return res.status(response.status).json({ message: response.message, data: audios });
        } catch (error) {
            console.error("Error in getAllAudios controller:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getAudioById(req, res) {

        const { id } = req.params;

        try {
            const response = await ModelAudio.getById(id);

            if (response.status === 404) return res.status(response.status).json({ message: response.message });

            const audio = {
                id: response.audio.audio_id,
                idioma: response.audio.idioma,
                formato: response.audio.formato,
                duration: response.audio.duration,
                size: response.audio.size,
                video_id: response.audio.video_id,
                path: `${req.protocol}://${req.get('host')}/audios/${response.audio.path}`,
            };

            return res.status(200).json({ message: "Audio retrieved successfully", data: audio });
        } catch (error) {
            console.error("Error in getAudioById controller:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateAudio(req, res) {

        const { id } = req.params;
        const file = req.file;
        const result = validateAudioUpdate(req.body);

        if (!result.success) return res.status(422).json({ message: result.error.errors[0].message });
        if (!id) return res.status(400).json({ message: "Audio ID is required" });
        if (!file) return res.status(400).json({ message: "No file uploaded" });

        try {

            // eliminar el audio anterior si existe
            const existingAudio = await ModelAudio.getById(id);
            if (existingAudio.status === 404) return res.status(existingAudio.status).json({ message: existingAudio.message });

            const previousPath = path.join(__dirname, 'uploads', 'audios', existingAudio.audio.path);
            if (fs.existsSync(previousPath)) {
                console.log('Deleting previous audio file:', previousPath);
                fs.unlinkSync(previousPath);
            }

            // obtener los metadatos del nuevo archivo
            const filePath = path.resolve(file.path);
            const metadata = await parseFile(filePath);

            const data = {
                idioma: result.data.idioma,
                formato: file.mimetype,
                duration: metadata.format.duration,
                size: file.size,
                path: file.filename,
            };

            const response = await ModelAudio.update(id, data);

            if (response.status === 404) return res.status(response.status).json({ message: response.message });

            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            console.error("Error in updateAudio controller:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async deleteAudio(req, res) {

        const { id } = req.params;

        if (!id) return res.status(400).json({ message: "Audio ID is required" });

        try {

            // obtener el audio a eliminar
            const existingAudio = await ModelAudio.getById(id);
            if (existingAudio.status === 404) return res.status(existingAudio.status).json({ message: existingAudio.message });

            const previousPath = path.join(__dirname, 'uploads', 'audios', existingAudio.audio.path);

            if (fs.existsSync(previousPath) && existingAudio.audio.path) {
                console.log('Deleting audio file:', previousPath);
                fs.unlinkSync(previousPath);
            }

            const response = await ModelAudio.delete(id);

            if (response.status === 404) return res.status(response.status).json({ message: response.message });

            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            console.error("Error in deleteAudio controller:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}