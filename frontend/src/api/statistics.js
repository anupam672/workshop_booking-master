import client from './client'

/**
 * Get public statistics with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.from_date - Start date (YYYY-MM-DD)
 * @param {string} params.to_date - End date (YYYY-MM-DD)
 * @param {string} params.state - Filter by state
 * @param {string} params.workshop_type - Filter by workshop type
 * @param {string} params.sort - Sort order (date_asc or date_desc)
 * @param {number} params.page - Page number for pagination
 * @returns {Promise<Object>} Statistics data with workshops, charts data
 */
export const getPublicStatistics = async ({ 
  from_date, 
  to_date, 
  state, 
  workshop_type, 
  sort, 
  page 
} = {}) => {
  const params = new URLSearchParams()
  
  if (from_date) params.append('from_date', from_date)
  if (to_date) params.append('to_date', to_date)
  if (state) params.append('state', state)
  if (workshop_type) params.append('workshop_type', workshop_type)
  if (sort) params.append('sort', sort)
  if (page) params.append('page', page)

  const response = await client.get(`/statistics/public/?${params.toString()}`)
  return response.data
}

/**
 * Download statistics as CSV
 * @param {Object} params - Same query parameters as getPublicStatistics
 * @returns {Promise<Blob>} CSV file blob
 */
export const downloadStatisticsCSV = async (params = {}) => {
  const searchParams = new URLSearchParams()
  
  if (params.from_date) searchParams.append('from_date', params.from_date)
  if (params.to_date) searchParams.append('to_date', params.to_date)
  if (params.state) searchParams.append('state', params.state)
  if (params.workshop_type) searchParams.append('workshop_type', params.workshop_type)
  if (params.sort) searchParams.append('sort', params.sort)
  
  searchParams.append('download', 'true')

  const response = await client.get(`/statistics/public/?${searchParams.toString()}`, {
    responseType: 'blob',
  })
  
  return response
}

/**
 * Get team statistics - all teams or specific team
 * @param {number|null} teamId - Team ID (null for all teams)
 * @returns {Promise<Object>} Team statistics with labels, counts, and team list
 */
export const getTeamStatistics = async (teamId = null) => {
  const endpoint = teamId ? `/statistics/team/${teamId}/` : '/statistics/team/'
  const response = await client.get(endpoint)
  return response.data
}
