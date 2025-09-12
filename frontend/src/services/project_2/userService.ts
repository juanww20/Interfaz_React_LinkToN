import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
})

export const userService = {
  async getUsers() {
    try {
      const res = await api.get('/auth/')
      console.log(res.data.message)
      return {
        active: res.data.data.active,
        desactive: res.data.data.desactive,
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      return false
    }
  },

  async createUser(data: any) {
    try {
      const res = await api.post('/auth/register', data)
      console.log('Usuario creado:', res.data)
      return true
    } catch (error) {
      console.error('Error al crear usuario:', error)
      return false
    }
  },

  async updateUser(id: string, data: any) {
    try {
      await api.patch(`/auth/${id}`, data)
      return true
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
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

  async logout() {
    try {
      const res = await api.post('/auth/logout', {})
      if (res.status === 200) return true
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
    return false
  },

  async getUserID() {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.user_id || null;
      }
      return null;
    } catch (error) {
      console.log('Error fetching user ID:', error);
      return null;
    }
  },

  async getUserById(id: string) {
    try {
      const res = await api.get(`/auth/${id}`)
      return { status: true, data: res.data.data }
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error)
      return false
    }
  },

  async getSectionId() {
    try {
      const res = await api.get('/auth/me')
      return { status: true, data: res.data.data }
    } catch (error : any) {
      if (error.response?.status === 401) {
        // No logueado
        return { status: false }
      }
      // Otro tipo de error
      console.error('Error al obtener sección por ID:', error)
      return { status: false, error: 'internal' }
    }
  }

}
