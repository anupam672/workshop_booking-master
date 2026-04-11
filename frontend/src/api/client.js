import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

/**
 * Create axios instance with base URL pointing to Django backend
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor - Add JWT token to Authorization header
 */
client.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response interceptor - Handle 401 by refreshing token
 */
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const { refreshToken, setAuth, clearAuth } = useAuthStore.getState()

      if (!refreshToken) {
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
        const response = await axios.post(`${baseURL}/auth/token/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data

        // Update store with new access token
        const currentState = useAuthStore.getState()
        setAuth({
          user: currentState.user,
          accessToken: access,
          refreshToken,
        })

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`
        return client(originalRequest)
      } catch (refreshError) {
        // Token refresh failed, logout user
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default client

