import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { loginUser, registerUser, logoutUser } from '../api/auth';

export default function useAuth() {
  const navigate = useNavigate();
  const { user, refreshToken, setAuth, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;
  const isInstructor = user?.is_instructor === true;

  const login = async ({ username, password }) => {
    try {
      setIsLoading(true);
      const data = await loginUser({ username, password });

      setAuth(data.access, data.refresh, data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');

      return { isLoading: false };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      setIsLoading(true);
      await registerUser(formData);

      toast.success('Registration successful. Check your email!');
      navigate('/activate');

      return { isLoading: false };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await logoutUser({ refresh: refreshToken });
      }
    } catch (err) {
      // Continue logout even if API call fails
    } finally {
      clearAuth();
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  return {
    user,
    isAuthenticated,
    isInstructor,
    isLoading,
    login,
    register,
    logout,
  };
}
