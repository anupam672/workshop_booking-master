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
      // Extract error message from various response structures
      let message = 'Registration failed. Please try again.'
      
      if (err.response?.data) {
        const data = err.response.data
        
        // Try direct error field
        if (data.error) message = data.error
        else if (data.detail) message = data.detail
        
        // Try specific field errors (user fields)
        else if (data.username?.[0]) message = data.username[0]
        else if (data.email?.[0]) message = data.email[0]
        else if (data.password?.[0]) message = data.password[0]
        else if (data.first_name?.[0]) message = data.first_name[0]
        else if (data.last_name?.[0]) message = data.last_name[0]
        
        // Try nested profile field errors
        else if (data.profile) {
          if (typeof data.profile === 'string') {
            message = data.profile
          } else if (typeof data.profile === 'object') {
            const profileErrors = data.profile
            if (profileErrors.phone_number?.[0]) message = `Phone: ${profileErrors.phone_number[0]}`
            else if (profileErrors.institute?.[0]) message = `Institute: ${profileErrors.institute[0]}`
            else if (profileErrors.department?.[0]) message = `Department: ${profileErrors.department[0]}`
            else if (profileErrors.title?.[0]) message = `Title: ${profileErrors.title[0]}`
            else if (profileErrors.position?.[0]) message = `Position: ${profileErrors.position[0]}`
            else if (profileErrors.how_did_you_hear_about_us?.[0]) message = `How did you hear about us: ${profileErrors.how_did_you_hear_about_us[0]}`
            else if (profileErrors.location?.[0]) message = `Location: ${profileErrors.location[0]}`
            else if (profileErrors.state?.[0]) message = `State: ${profileErrors.state[0]}`
            else {
              // Generic profile error
              const firstKey = Object.keys(profileErrors)[0]
              if (firstKey && profileErrors[firstKey]?.[0]) {
                message = `${firstKey}: ${profileErrors[firstKey][0]}`
              }
            }
          }
        }
        
        // Log full error for debugging
        console.error('Registration error details:', data)
      }
      
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
