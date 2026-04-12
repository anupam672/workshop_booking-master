import client from './client'

/**
 * Workshops API Functions
 * All functions return response.data
 */

export const getWorkshops = async () => {
  const response = await client.get('/workshops/')
  return response.data
}

export const getWorkshopById = async (id) => {
  const response = await client.get(`/workshops/${id}/`)
  return response.data
}

export const proposeWorkshop = async (data) => {
  const response = await client.post('/workshops/', data)
  return response.data
}

export const acceptWorkshop = async (id) => {
  const response = await client.post(`/workshops/${id}/accept/`)
  return response.data
}

export const changeWorkshopDate = async (id, data) => {
  const response = await client.post(`/workshops/${id}/change-date/`, data)
  return response.data
}

export const getWorkshopComments = async (id) => {
  const response = await client.get(`/workshops/${id}/comments/`)
  return response.data
}

export const postComment = async (id, data) => {
  const response = await client.post(`/workshops/${id}/comments/`, data)
  return response.data
}

export const getWorkshopTypes = async ({ page = 1 } = {}) => {
  const response = await client.get('/workshop-types/', {
    params: { page },
  })
  return response.data
}

export const getWorkshopTypeById = async (id) => {
  const response = await client.get(`/workshop-types/${id}/`)
  return response.data
}

export const getWorkshopTypeTNC = async (id) => {
  const response = await client.get(`/workshop-types/${id}/tnc/`)
  return response.data
}

export const createWorkshopType = async (data) => {
  const response = await client.post('/workshop-types/', data)
  return response.data
}

export const updateWorkshopType = async (id, data) => {
  const response = await client.patch(`/workshop-types/${id}/`, data)
  return response.data
}

