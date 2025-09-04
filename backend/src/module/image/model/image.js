import { Image } from "../../../models/tables.js";

export class ModelImage {

    static async create(data) {

        try {

            const image = await Image.create(data);

            return {message: "Imagen creada correctamente", data: image, status: 201};
            
        } catch (error) {
            console.error('Error creating image:', error);
            throw error;
        }
    }

    static async getAll() {

        try {

            const images = await Image.findAll();

            if (images.length === 0) return {message: "No images found", data: [], status: 404};

            return {message: "Imagenes obtenidas correctamente", data: images, status: 200};
            
        } catch (error) {
            console.error('Error getting images:', error);
            throw error;
        }
    }

    static async getById(id) {

        try {

            const image = await Image.findByPk(id);

            if (!image) return {message: "Image not found", data: null, status: 404};

            return {message: "Imagen obtenida correctamente", data: image, status: 200};
            
        } catch (error) {
            console.error('Error getting image by id:', error);
            throw error;
        }
    }

    static async update(id, data) {

        try {

            const [updated] = await Image.update(data, { where: { image_id : id } });

            if (updated === 0) return {message: "Image not found", status: 404};

            const updatedImage = await Image.findByPk(id);

            return {message: "Imagen actualizada correctamente", data: updatedImage, status: 200};
            
        } catch (error) {
            console.error('Error updating image by id:', error);
            throw error;
        }
    }

    static async delete(id) {

        try {

            const deleted = await Image.destroy({ where: { image_id: id } });

            if (deleted === 0) return {message: "Image not found", status: 404};

            return {message: "Imagen eliminada correctamente", status: 200};
            
        } catch (error) {
            console.error('Error deleting image by id:', error);
            throw error;
        }
    }
}