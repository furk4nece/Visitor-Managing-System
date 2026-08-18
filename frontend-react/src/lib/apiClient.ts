import axios from 'axios'

// Backend Quarkus API. Aynı Svelte projesindeki gibi /api altında
// çalışıyor ve vite.config.ts'teki proxy 8080'e yönlendiriyor.
export const api = axios.create({
  baseURL: '/api/v1',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vms_token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('vms_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
