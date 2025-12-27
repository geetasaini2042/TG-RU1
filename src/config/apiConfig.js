// Yahan Base URL change karne se puri app me change ho jayega
export const API_BASE_URL = "http://127.0.0.1:5000";

export const API_ENDPOINTS = {
  // User related
  CHECK_USER: `${API_BASE_URL}/api/user/check`, // (Hypothetical endpoint)
  REGISTER_USER: `${API_BASE_URL}/api/user/register`,
  
  // Data related
  GET_COLLEGES: (id) => `${API_BASE_URL}/api/colleges/${id}`,
  GET_COURSES: (id) => `${API_BASE_URL}/courses/${id}`, // ID yahan University ya College ki ho sakti hai
};

export const STATIC_FILES = {
  UNIVERSITIES: './universities.json' // Public folder me hogi
};
