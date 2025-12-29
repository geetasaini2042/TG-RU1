import { API_ENDPOINTS } from '../config/apiConfig';
import { getSecureHeaders } from '../utils/security';

// Fetch Content (Folders/Files)
export const fetchStudyContent = async (collegeCode, courseId, parentId = null) => {
  try {
    const response = await fetch(API_ENDPOINTS.GET_STUDY_CONTENT, {
      method: 'POST',
      headers: {
        ...getSecureHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        collegeCode, 
        courseId, 
        parentId // Null means root (Semesters), otherwise folder ID
      })
    });
    
    const data = await response.json();
    // Structure: [{ id, name, type: 'folder'|'file', fileType: 'pdf'|'video', ... }]
    return data.STATUS_CODE === 200 ? data.RESPONSE : [];
  } catch (error) {
    console.error("Study Content Error", error);
    return [];
  }
};

// Send File via Bot
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
