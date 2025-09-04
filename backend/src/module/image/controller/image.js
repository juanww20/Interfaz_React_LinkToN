import { ModelImage } from "../model/image.js";
import sharp from "sharp";
import fs from 'fs';
import path from 'path';
import { UPLOADS_DIR } from "../../../utils/global-path.js";

const __dirname = UPLOADS_DIR;

export class ControllerImage {

    static async createImage(req, res) {

        const file = req.file;

        if(!file) return res.status(400).json({ message: "No file uploaded" });

        // obtener dimensiones de la imagen
        const image = sharp(file.path);
        const metadata = await image.metadata();

        const data = {
            nombre: file.originalname,
            formato: metadata.format,
            size: file.size,
            dimensions: `${metadata.width}x${metadata.height}`,
            path: file.filename,
        }


        try {

            const response = await ModelImage.create(data);

            return res.status(response.status).json({message: response.message, data : response.data});

        } catch (error) {
            console.error('Error creating image:', error);
            return res.status(500).json({ message: "Error creating image", error });
        }
    }

    static async getAllImages(req, res) {

        try {

            const response = await ModelImage.getAll();

            const data = response.data.map(image => {
                return {
                    image_id: image.image_id,
                    name: image.nombre,
                    format: image.formato,
                    size: image.size,
                    dimension: image.dimensions,
                    url: `${req.protocol}://${req.get('host')}/images/${image.path}`
                }
            });


            return res.status(response.status).json({message: response.message, data : data});

        } catch (error) {
            console.error('Error getting images:', error);
            return res.status(500).json({ message: "Error getting images", error });
        }
    }

    static async getImageById(req, res) {

        const { id } = req.params;

        if(!id) return res.status(400).json({ message: "No id provided" });

        try {

            const response = await ModelImage.getById(id);

            if(response.status === 404) return res.status(response.status).json({message: response.message});

            const data = {
                image_id: response.data.image_id,
                name: response.data.nombre,
                format: response.data.formato,
                size: response.data.size,
                dimension: response.data.dimensions,
                url: `${req.protocol}://${req.get('host')}/images/${response.data.path}`
            };

            return res.status(response.status).json({message: response.message, data : data});

        } catch (error) {
            console.error('Error getting image by id:', error);
            return res.status(500).json({ message: "Error getting image", error });
        }
    }

    static async updateImage(req, res) {

        const { id } = req.params;
        const file = req.file;

        if(!id) return res.status(400).json({ message: "No id provided" });
        if(!file) return res.status(400).json({ message: "No file uploaded" });

        try {

            // eliminar imagen anterior si existe
            const imageOld = await ModelImage.getById(id);
            if (!imageOld || imageOld.status === 404) {
                return res.status(404).json({ message: 'Imagen no encontrada' });
            }

            // Borrar imagen física anterior
            const previousPath = path.join(__dirname, 'uploads', 'images', imageOld.data.path);
            if (fs.existsSync(previousPath)) {
                console.log('Borrando imagen anterior:', previousPath);
                fs.unlinkSync(previousPath);
            }

            // obtener dimensiones de la imagen
            const image = sharp(file.path);
            const metadata = await image.metadata();

            const data = {
                nombre: file.originalname,
                formato: metadata.format,
                size: file.size,
                dimensions: `${metadata.width}x${metadata.height}`,
                path: file.filename,
            }

            const response = await ModelImage.update(id, data);

            return res.status(response.status).json({message: response.message, data : response.data});

        } catch (error) {
            console.error('Error updating image:', error);
            return res.status(500).json({ message: "Error updating image", error });
        }
    }

    static async deleteImage(req, res) {

        const { id } = req.params;

        if(!id) return res.status(400).json({ message: "No id provided" });

        try {

            // eliminar imagen anterior si existe
            const imageOld = await ModelImage.getById(id);
            if (!imageOld || imageOld.status === 404) {
                return res.status(404).json({ message: 'Imagen no encontrada' });
            }

            // Borrar imagen física anterior
            const previousPath = path.join(__dirname, 'uploads', 'images', imageOld.data.path);
            if (fs.existsSync(previousPath)) {
                console.log('Borrando imagen anterior:', previousPath);
                fs.unlinkSync(previousPath);
            }

            const response = await ModelImage.delete(id);

            return res.status(response.status).json({message: response.message});

        } catch (error) {
            console.error('Error deleting image:', error);
            return res.status(500).json({ message: "Error deleting image", error });
        }
    }
}