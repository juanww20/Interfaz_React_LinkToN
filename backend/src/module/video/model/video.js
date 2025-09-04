import { Video, Audio, Subtitulo } from "../../../models/tables.js";

export class ModelVideo {

    static async create(data) {

        try {

            const video = await Video.create(data);

            return { message: "Video creado correctamente", data: video, status: 201 };
            
        } catch (error) {
            console.error("Error creating video model:", error);
            throw new Error("Failed to create video model");
            
        }
    }

    static async getAll() {

        try {

            const videos = await Video.findAll({
                include: [{
                    model: Audio,
                    as: "audios"
                }, {
                    model: Subtitulo,
                    as: "subtitulos"
                }]
            });

            if (!videos || videos.length === 0) return { message: "No videos found", data: [], status: 404 };

            return { message: "Videos retrieved successfully", data: videos, status: 200 };
            
        } catch (error) {
            console.error("Error retrieving videos:", error);
            throw new Error("Failed to retrieve videos");
            
        }
    }

    static async getById(id) {

        try {

            const video = await Video.findByPk(id);

            if (!video) return { message: "Video not found", data: null, status: 404 };

            return { message: "Video retrieved successfully", data: video, status: 200 };
            
        } catch (error) {
            console.error("Error retrieving video by ID:", error);
            throw new Error("Failed to retrieve video by ID");
            
        }
    }

    static async update(id, data) {

        try {

            const video = await Video.findByPk(id);

            if (!video) return { message: "Video not found", data: null, status: 404 };

            await video.update(data);

            return { message: "Video updated successfully", data: video, status: 200 };
            
        } catch (error) {
            console.error("Error updating video:", error);
            throw new Error("Failed to update video");
            
        }
    }
    
    static async delete(id) {

        try {

            const video = await Video.findByPk(id);

            if (!video) return { message: "Video not found", data: null, status: 404 };

            await video.destroy();

            return { message: "Video deleted successfully", data: null, status: 200 };
            
        } catch (error) {
            console.error("Error deleting video:", error);
            throw new Error("Failed to delete video");
            
        }
    }
}