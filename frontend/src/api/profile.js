import client from './client'

/**
 * Get the authenticated user's own profile
 * @returns {Promise<Object>} Profile data with user and profile info
 */
export const getOwnProfile = async () => {
  const response = await client.get('/profile/me/')
  return response.data
}

/**
 * Update the authenticated user's own profile
 * @param {Object} data - Profile data to update (included user fields like first_name, last_name)
 * @returns {Promise<Object>} Updated profile data
 */
export const updateOwnProfile = async (data) => {
  const response = await client.patch('/profile/me/', data)
  return response.data
}

/**
 * Get a specific coordinator's profile by user ID
 * @param {number} userId - User ID of the coordinator
 * @returns {Promise<Object>} Coordinator profile data with workshops
 */
export const getCoordinatorProfile = async (userId) => {
  const response = await client.get(`/profile/${userId}/`)
  return response.data
}

/**
 * Change password for authenticated user
 * @param {Object} data - Password change data
 * @param {string} data.old_password - Current password
 * @param {string} data.new_password1 - New password
 * @param {string} data.new_password2 - New password confirmation
 * @returns {Promise<Object>} Success response
 */
export const changePassword = async ({ old_password, new_password1, new_password2 }) => {
  const response = await client.post('/auth/password-change/', {
    old_password,
    new_password1,
    new_password2,
  })
  return response.data
}
