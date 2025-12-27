export const API_BASE_URL = "http://127.0.0.1:5000"; // Apna URL lagayein

export const API_ENDPOINTS = {
  CHECK_USER: `${API_BASE_URL}/api/user/check`,
  REGISTER_USER: `${API_BASE_URL}/api/user/register`,
  VALIDATE_TOKEN: `${API_BASE_URL}/api/user/validate-token`, // 10s check ke liye
  
  // Data related
  GET_COLLEGES: (id) => `${API_BASE_URL}/api/colleges/${id}`,
  GET_COURSES: (id) => `${API_BASE_URL}/courses/${id}`,
};

export const STATIC_FILES = {
  UNIVERSITIES: './universities.json'
};
