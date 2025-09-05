// src/services/apiService.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
})

export const apiService = {
  async getStyles() {
    try {
      const colors = await api.get('/color/')
      console.log(colors.data.message)
      return colors.data.data
      
    } catch (error) {
      console.error('Error al obtener la configuración por defecto:', error)
      return []
    }
  },

  async getFontStyles() {
    try {
      const fonts = await api.get('/font/')
      console.log(fonts.data.message)
      return fonts.data.data
    } catch (error) {
      console.error('Error al obtener fuentes:', error)
      return []
    }
  },

  async createStyles(data: any) {
    try {
      const res = await api.post('/color/', data)
      if (res) {
        console.log('Estilos creados:', res.data)
        return true
      }
    } catch (error) {
      console.error('Error al crear los estilos:', error)
    }
    return false
  },

  async createFontStyles(data: any) {
    try {
      const res = await api.post('/font/', data)
      if (res) {
        console.log('Fuentes creadas:', res.data)
        return true
      }
    } catch (error) {
      console.error('Error al crear fuentes:', error)
    }
    return false
  },

  async deleteColors(id: string) {
    try {
      await api.delete(`/color/${id}`)
      return true
    } catch (error) {
      console.error('Error al eliminar color:', error)
      return false
    }
  },

  async deleteFonts(id: string) {
    try {
      await api.delete(`/font/${id}`)
      return true
    } catch (error) {
      console.error('Error al eliminar fuente:', error)
      return false
    }
  },

  async updateColor(id: string, data: any) {
    try {
      await api.patch(`/color/${id}`, data)
      return true
    } catch (error) {
      console.error('Error al actualizar color:', error)
      return false
    }
  },

  async updateFont(id: string, data: any) {
    try {
      await api.patch(`/font/${id}`, data)
      return true
    } catch (error) {
      console.error('Error al actualizar fuente:', error)
      return false
    }
  },

  async updateFontFamily(id: string, data: any) {
    try {
      await api.patch(`/font/family/${id}`, data)
      return true
    } catch (error) {
      console.error('Error al actualizar familia de fuente:', error)
      return false
    }
  },

  async login(data: { email: string; password: string }) {
    try {
      const res = await api.post('/auth/login', data)
      console.log(res.data.message)
      return { status: true, data: res.data.data }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      return false
    }
  },
}
