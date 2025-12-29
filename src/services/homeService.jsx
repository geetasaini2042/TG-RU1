import { API_ENDPOINTS } from '../config/apiConfig';
import { getSecureHeaders } from '../utils/security';

// 1. Fetch Banners
export const fetchBanners = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.GET_BANNERS, {
      headers: getSecureHeaders()
    });
    const data = await response.json();
    return data.STATUS_CODE === 200 ? data.RESPONSE : [];
  } catch (error) {
    console.error("Banner Fetch Error", error);
    return [];
  }
};

// 2. Fetch Telegram Channels
export const fetchChannels = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.GET_TELEGRAM_CHANNELS, {
      headers: getSecureHeaders()
    });
    const data = await response.json();
    return data.STATUS_CODE === 200 ? data.RESPONSE : [];
  } catch (error) {
    console.error("Channel Fetch Error", error);
    return [];
  }
};

// 3. Fetch Syllabus
export const fetchSyllabus = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.GET_SYLLABUS_LIST, {
      headers: getSecureHeaders()
    });
    const data = await response.json();
    return data.STATUS_CODE === 200 ? data.RESPONSE : [];
  } catch (error) {
    console.error("Syllabus Fetch Error", error);
    return [];
  }
};
