export const placeholder = true


  // Register
  register: (data) =>
    client.post('/register/', data),

  // Refresh token
  refreshToken: (refreshToken) =>
    client.post('/token/refresh/', { refresh: refreshToken }),

  // Get current user
  getCurrentUser: () =>
    client.get('/user/'),

  // Update user profile
  updateProfile: (data) =>
    client.put('/user/', data),

  // Change password
  changePassword: (data) =>
    client.post('/user/change-password/', data),

  // Logout
  logout: () =>
    client.post('/logout/', {}),
}
