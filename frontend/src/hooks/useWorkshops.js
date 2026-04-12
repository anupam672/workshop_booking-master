import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  getWorkshops,
  getWorkshopById,
  getWorkshopTypes,
  getWorkshopTypeById,
  getWorkshopTypeTNC,
  proposeWorkshop as proposeWorkshopApi,
  acceptWorkshop as acceptWorkshopApi,
  getWorkshopComments,
  postComment as postCommentApi,
} from '../api/workshops'

/**
 * Hook to fetch all workshops
 * Returns workshops data with derived accepted/pending arrays
 */
export function useWorkshops() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['workshops'],
    queryFn: getWorkshops,
  })

  const workshops = data || []
  const acceptedWorkshops = workshops.filter((w) => w.status === 1)
  const pendingWorkshops = workshops.filter((w) => w.status === 0)

  return {
    workshops,
    acceptedWorkshops,
    pendingWorkshops,
    isLoading,
    isError,
    error,
  }
}

/**
 * Hook to fetch a single workshop by ID
 */
export function useWorkshopById(id) {
  return useQuery({
    queryKey: ['workshop', id],
    queryFn: () => getWorkshopById(id),
    enabled: !!id,
  })
}

/**
 * Hook to fetch workshop types with pagination
 */
export function useWorkshopTypes(page = 1) {
  return useQuery({
    queryKey: ['workshopTypes', page],
    queryFn: () => getWorkshopTypes({ page }),
  })
}

/**
 * Hook to fetch a single workshop type by ID
 */
export function useWorkshopTypeById(id) {
  return useQuery({
    queryKey: ['workshopType', id],
    queryFn: () => getWorkshopTypeById(id),
    enabled: !!id,
  })
}

/**
 * Hook to fetch workshop type Terms & Conditions
 */
export function useWorkshopTypeTNC(id) {
  return useQuery({
    queryKey: ['workshopTypeTNC', id],
    queryFn: () => getWorkshopTypeTNC(id),
    enabled: !!id,
  })
}

/**
 * Hook to propose a new workshop
 */
export function useProposeWorkshop() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: proposeWorkshopApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] })
      toast.success('Workshop proposed successfully!')
      navigate('/workshops')
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || 'Failed to propose workshop'
      )
    },
  })

  return {
    propose: mutation.mutate,
    isProposing: mutation.isPending,
  }
}

/**
 * Hook to accept a workshop
 */
export function useAcceptWorkshop() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: acceptWorkshopApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] })
      toast.success('Workshop accepted!')
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || 'Failed to accept workshop'
      )
    },
  })

  return {
    accept: mutation.mutate,
    isAccepting: mutation.isPending,
  }
}

/**
 * Hook to fetch workshop comments
 */
export function useWorkshopComments(workshopId) {
  return useQuery({
    queryKey: ['comments', workshopId],
    queryFn: () => getWorkshopComments(workshopId),
    enabled: !!workshopId,
  })
}

/**
 * Hook to post a comment on a workshop
 */
export function usePostComment(workshopId) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data) => postCommentApi(workshopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', workshopId] })
      toast.success('Comment posted!')
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to post comment')
    },
  })

  return {
    postComment: mutation.mutate,
    isPosting: mutation.isPending,
  }
}
