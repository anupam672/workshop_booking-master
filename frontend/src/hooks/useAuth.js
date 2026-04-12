import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { loginUser, registerUser, logoutUser } from '../api/auth'

export default function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore()
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)

  // Derived state
  const isInstructor = user?.is_instructor === true
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : ''

  const login = async ({ username, password }) => {
    setIsLoginLoading(true)
    try {
      const data = await loginUser({ username, password })
      setAuth({
        user: data.user,
        accessToken: data.access,
        refreshToken: data.refresh,
      })
      toast.success(`Welcome back, ${data.user.first_name}!`)
      navigate('/dashboard')
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Login failed. Please check your credentials.'
      toast.error(message)
      throw err
    } finally {
      setIsLoginLoading(false)
    }
  }

  const register = async (formData) => {
    setIsRegisterLoading(true)
    try {
      await registerUser(formData)
      toast.success('Registration successful! Check your email.')
      navigate('/activate')
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        'Registration failed. Please try again.'
      toast.error(message)
      throw err
    } finally {
      setIsRegisterLoading(false)
    }
  }

  const logout = async () => {
    setIsLogoutLoading(true)
    try {
      const { refreshToken } = useAuthStore.getState()
      if (refreshToken) {
        await logoutUser({ refresh: refreshToken })
      }
    } catch (err) {
      // Silent — still log out locally even if API fails
    } finally {
      clearAuth()
      navigate('/login')
      toast.success('Logged out successfully')
      setIsLogoutLoading(false)
    }
  }

  return {
    user,
    isAuthenticated,
    isInstructor,
    fullName,
    login,
    register,
    logout,
    isLoginLoading,
    isRegisterLoading,
    isLogoutLoading,
  }
}
