// src/config/apiConfig.js

// 🔥 NEW RENDER URL
export const API_BASE_URL = "https://webapp-api-46qi.onrender.com"; 

export const API_ENDPOINTS = {
  // Auth & Check
  CHECK_USER: `${API_BASE_URL}/api/user/check`,
  LOGIN_USER: `${API_BASE_URL}/api/user/login`,
  REGISTER_USER: `${API_BASE_URL}/api/user/register`,
  VALIDATE_TOKEN: `${API_BASE_URL}/api/user/validate-token`,
  
  // Profile Updates
  UPDATE_DETAIL: `${API_BASE_URL}/api/user/update/detail`,
  UPDATE_PHOTO: `${API_BASE_URL}/api/profile/update-photo`,
  
  // Data Fetching
  GET_COLLEGES: (id) => `${API_BASE_URL}/api/colleges/${id}`,
  GET_COURSES: (id) => `${API_BASE_URL}/courses/${id}`,
};

export const STATIC_FILES = {
  UNIVERSITIES: './universities.json'
};
