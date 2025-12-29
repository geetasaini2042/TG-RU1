import { API_ENDPOINTS } from '../config/apiConfig';
import { getSecureHeaders } from '../utils/security';

export const fetchStudyContent = async (collegeCode, courseId, parentId = null) => {
  try {
    const response = await fetch(API_ENDPOINTS.GET_STUDY_CONTENT, {
      method: 'POST',
      headers: { ...getSecureHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeCode, courseId, parentId })
    });
    
    const result = await response.json();
    
    // 🔥 Strict Check: Aapke format ke hisab se
    if (result.Ok === true && Array.isArray(result.data)) {
        return { success: true, data: result.data };
    } else {
        return { success: false, message: result.message || "Invalid Data Format" };
    }
  } catch (error) {
    return { success: false, message: "Server Connection Failed" };
  }
};
export const sendFileViaBot = async (fileUrl, fileName, userId, token) => {
    try {
        const response = await fetch(API_ENDPOINTS.SEND_FILE_VIA_BOT, {
            method: 'POST',
            headers: {
                ...getSecureHeaders(),
                'Authorization': `Bearer ${token}`,
                'X-User-ID': userId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ file_url: fileUrl, file_name: fileName })
        });
        const data = await response.json();
        return data.STATUS_CODE === 200;
    } catch (e) {
        return false;
    }
};
