import { Subtitulo } from "../../../models/tables.js"

export class ModelSubtitulo {

    static async create(subtitulo) {
        
        try {
            const subtitle = await Subtitulo.create(subtitulo)
            return { message: "Subtitle created successfully", data: subtitle, status: 201 }
            
        } catch (error) {
            console.error("Error creating subtitle:", error)
            throw new Error("Failed to create subtitle")
        }
    }

    static async getById(id) {
        
        try {
            const subtitle = await Subtitulo.findByPk(id)
            if (!subtitle) return { message: "Subtitle not found", status: 404 }

            return { message: "Subtitle fetched successfully", data: subtitle, status: 200 }
            
        } catch (error) {
            console.error("Error fetching subtitle by ID:", error)
            throw new Error("Failed to fetch subtitle by ID")
            
        }
    }

    static async getAll() {

        try {
            const subtitles = await Subtitulo.findAll()

            if (subtitles.length === 0) return { message: "No subtitles found", status: 404 }

            return { message: "Subtitles fetched successfully", data: subtitles, status: 200 }
        } catch (error) {
            console.error("Error fetching all subtitles:", error)
            throw new Error("Failed to fetch all subtitles")
        }
    }

    static async update(id, subtitulo) {
        
        try {

            const subtitle = await Subtitulo.findByPk(id)
            if (!subtitle) return { message: "Subtitle not found", status: 404 }

            const updatedSubtitle = await subtitle.update(subtitulo)
            return { message: "Subtitle updated successfully", data: updatedSubtitle, status: 200 }
            
        } catch (error) {
            console.error("Error updating subtitle:", error)
            throw new Error("Failed to update subtitle")
            
        }
    }

    static async delete(id) {
        
        try {

            const subtitle = await Subtitulo.findByPk(id)
            if (!subtitle) return { message: "Subtitle not found", status: 404 }

            await subtitle.destroy()
            return { message: "Subtitle deleted successfully", status: 200 }
            
        } catch (error) {
            console.error("Error deleting subtitle:", error)
            throw new Error("Failed to delete subtitle")
            
        }
    }
}