// 🔥 NEW RENDER URL
export const API_BASE_URL = "https://webapp-api-46qi.onrender.com"; 

export const API_ENDPOINTS = {
  // Auth
  CHECK_USER: `${API_BASE_URL}/api/user/check`,
  LOGIN_USER: `${API_BASE_URL}/api/user/login`,
  REGISTER_USER: `${API_BASE_URL}/api/user/register`,
  VALIDATE_TOKEN: `${API_BASE_URL}/api/user/validate-token`,
  
  // Profile
  UPDATE_DETAIL: `${API_BASE_URL}/api/user/update/detail`,
  UPDATE_PHOTO: `${API_BASE_URL}/api/profile/update-photo`,
  
  // Data Fetching
  GET_COLLEGES: (uniId) => `${API_BASE_URL}/api/colleges/${uniId}`,
  DELETE_ACCOUNT: `${API_BASE_URL}/api/user/delete`,
  GET_BANNERS: `${API_BASE_URL}/api/home/banners`,
  GET_TELEGRAM_CHANNELS: `${API_BASE_URL}/api/home/channels`,
  GET_SYLLABUS_LIST: `${API_BASE_URL}/api/home/syllabus`,
  
  // 🔥 CHANGE: Ab Course College Code se aayega
  GET_COURSES: (collegeCode) => `${API_BASE_URL}/courses/${collegeCode}`,
  GET_STUDY_CONTENT: `${API_BASE_URL}/api/study-material/fetch`,
  SEND_FILE_VIA_BOT: `${API_BASE_URL}/api/study-material/send-file`, // Generic file sender
};

export const STATIC_FILES = {
  UNIVERSITIES: './universities.json'
};
