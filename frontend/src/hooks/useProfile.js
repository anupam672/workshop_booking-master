import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  getOwnProfile,
  updateOwnProfile as updateOwnProfileApi,
  getCoordinatorProfile,
  changePassword as changePasswordApi,
} from '../api/profile'

/**
 * Hook to fetch the authenticated user's own profile
 * @returns {Object} Profile and user data with loading states
 */
export function useOwnProfile() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: getOwnProfile,
  })

  const profile = data?.profile || null
  const user = data?.user || null

  return {
    profile,
    user,
    isLoading,
    isError,
    error,
  }
}

/**
 * Hook to update the authenticated user's profile
 * @returns {Object} Mutation function and status
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateOwnProfileApi,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', 'me'], data)
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] })
      toast.success('Profile updated successfully')
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || 'Profile update failed'
      toast.error(errorMsg)
    },
  })

  return {
    update: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  }
}

/**
 * Hook to fetch a coordinator's profile by user ID
 * @param {number} userId - User ID of the coordinator
 * @returns {Object} Coordinator profile and workshop data with loading states
 */
export function useCoordinatorProfile(userId) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getCoordinatorProfile(userId),
    enabled: !!userId,
  })

  const profile = data?.profile || null
  const user = data?.user || null
  const workshops = data?.workshops || []
  const workshopCount = data?.workshop_count || 0

  return {
    profile,
    user,
    workshops,
    workshopCount,
    isLoading,
    isError,
    error,
  }
}

/**
 * Hook to change password
 * @returns {Object} Mutation function and status
 */
export function useChangePassword() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      toast.success('Password changed successfully')
      navigate('/profile')
    },
    onError: (err) => {
      const errorMsg =
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.new_password2?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        'Password change failed'
      toast.error(errorMsg)
    },
  })

  return {
    changePassword: mutation.mutate,
    isChanging: mutation.isPending,
    error: mutation.error,
  }
}
