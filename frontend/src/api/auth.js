import apiClient from './client';

export const loginUser = async ({ username, password }) => {
  const response = await apiClient.post('/auth/login/', {
    username,
    password,
  });
  return response.data;
};

export const registerUser = async (formData) => {
  const response = await apiClient.post('/auth/register/', formData);
  return response.data;
};

export const logoutUser = async ({ refresh }) => {
  const response = await apiClient.post('/auth/logout/', {
    refresh,
  });
  return response.data;
};

export const activateUser = async (key) => {
  const response = await apiClient.get(`/auth/activate/${key}/`);
  return response.data;
};

export const requestPasswordReset = async ({ email }) => {
  const response = await apiClient.post('/auth/password-reset/', {
    email,
  });
  return response.data;
};

export const confirmPasswordReset = async ({ uid, token, new_password1, new_password2 }) => {
  const response = await apiClient.post('/auth/password-reset/confirm/', {
    uid,
    token,
    new_password1,
    new_password2,
  });
  return response.data;
};
