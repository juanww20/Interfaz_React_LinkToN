import { Audio } from "../../../models/tables.js";

export class ModelAudio {

    static async create(data) {
        
        try {
            const audio = await Audio.create(data);
            return { message: "Audio creado exitosamente", audio, status: 201 };
            
        } catch (error) {
            console.error("Error creating audio:", error);
            throw new Error("Failed to create audio");
        }
    }
  
    static async getAll() {
        try {
            const audios = await Audio.findAll();

            if (audios.length === 0) return { message: "No audios found", status: 404 };

            return { message: "Audios retrieved successfully", audios, status: 200 };
        } catch (error) {
            console.error("Error finding all audios:", error);
            throw new Error("Failed to find all audios");
        }
    }

    static async getById(id) {
        
        try {

            const audio = await Audio.findByPk(id);
            if (!audio) return { message: "Audio not found", status: 404 };

            return { message: "Audio found", audio, status: 200 };
            
        } catch (error) {
            console.error("Error finding audio by ID:", error);
            throw new Error("Failed to find audio by ID");
            
        }
    }

    static async update(id, data) {
        
        try {
            const audio = await Audio.findByPk(id);
            if (!audio) return { message: "Audio not found", status: 404 };

            const [updated] = await Audio.update(data, { where: { audio_id: id } });
            
            return { message: "Audio updated successfully", status: 200 };

        } catch (error) {
            console.error("Error updating audio:", error);
            throw new Error("Failed to update audio");
        }
    }

    static async delete(id) {
        try {

            const audio = await Audio.findByPk(id);
            if (!audio) return { message: "Audio not found", status: 404 };

            await Audio.destroy({ where: { audio_id: id } });
            return { message: "Audio deleted successfully", status: 200 };
        } catch (error) {
            console.error("Error deleting audio:", error);
            throw new Error("Failed to delete audio");
        }
    }

}