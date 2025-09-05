import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
})


// metodos para el modulo de video
export const videoService = {

  async getVideos() {
    try {
        const response = await api.get('/video/');
        return response.data;
    } catch (error) {
        console.error('Error fetching videos:', error);
        throw error;
    }
  },

  async getVideo(id: String) {
    try {
        const response = await api.get(`/video/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching video:', error);
        throw error;
    }
  },

  async createVideo(data: any) {
    try {
        const response = await api.post('/video/', data);
        return response.data;
    } catch (error) {
        console.error('Error creating video:', error);
        throw error;
    }
  },

  async updateVideo(id: String, data: any) {
    try {
        const response = await api.put(`/video/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating video:', error);
        throw error;
    }
  },

  async deleteVideo(id: String) {
    try {
        const response = await api.delete(`/video/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting video:', error);
        throw error;
    }
  }
}


// metodos para el modulo de audio
export const audioService = {

    async getAudios() {
        try {
            const response = await api.get('/audio/');
            return response.data;
        } catch (error) {
            console.error('Error fetching audios:', error);
            throw error;
        }
    },

    async getAudio(id: number) {
        try {
            const response = await api.get(`/audio/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching audio:', error);
            throw error;
        }
    },

    async createAudio(data: any) {
        try {
            const response = await api.post('/audio/', data);
            return response.data;
        } catch (error) {
            console.error('Error creating audio:', error);
            throw error;
        }
    },

    async updateAudio(id: number, data: any) {
        try {
            const response = await api.put(`/audio/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating audio:', error);
            throw error;
        }
    },

    async deleteAudio(id: number) {
        try {
            const response = await api.delete(`/audio/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting audio:', error);
            throw error;
        }
    }
}


// metodos para el modulo de subtitulo
export const subtituloService = {

    async getSubtitulos() {
        try {
            const response = await api.get('/subtitle/');
            return response.data;
        } catch (error) {
            console.error('Error fetching subtitulos:', error);
            throw error;
        }
    },

    async getSubtitulo(id: number) {
        try {
            const response = await api.get(`/subtitle/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subtitulo:', error);
            throw error;
        }
    },

    async createSubtitulo(data: any) {
        try {
            const response = await api.post('/subtitle/', data);
            return response.data;
        } catch (error) {
            console.error('Error creating subtitulo:', error);
            throw error;
        }
    },

    async updateSubtitulo(id: number, data: any) {
        try {
            const response = await api.put(`/subtitle/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating subtitulo:', error);
            throw error;
        }
    },

    async deleteSubtitulo(id: number) {
        try {
            const response = await api.delete(`/subtitle/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting subtitulo:', error);
            throw error;
        }
    }
}


// metodos para el modulo de imagen
export const imageService = {

    async getImages() {
        try {
            const response = await api.get('/image/');
            return response.data;
        } catch (error) {
            console.error('Error fetching images:', error);
            throw error;
        }
    },

    async getImage(id: number) {
        try {
            const response = await api.get(`/image/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching image:', error);
            throw error;
        }
    },

    async createImage(data: any) {
        try {
            const response = await api.post('/image/', data);
            return response.data;
        } catch (error) {
            console.error('Error creating image:', error);
            throw error;
        }
    },

    async updateImage(id: number, data: any) {
        try {
            const response = await api.put(`/image/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating image:', error);
            throw error;
        }
    },

    async deleteImage(id: number) {
        try {
            const response = await api.delete(`/image/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }
}