const tg = window.Telegram?.WebApp;

// 1. Check if running inside Telegram
export const isTelegramEnvironment = () => {
  // initData tabhi hota hai jab Telegram ke andar ho
  return !!tg?.initData;
};

// 2. Secure Headers for API Calls
export const getSecureHeaders = () => {
  if (!tg?.initData) return {};

  return {
    'Content-Type': 'application/json',
    // Ye sabse important hai: Telegram ka encrypted data
    'X-Telegram-Init-Data': tg.initData, 
    // Backend isse verify karega ki ye data asli hai ya fake
    'X-Telegram-Hash': tg.initDataUnsafe?.hash,
    // User ID header me bhejo taaki backend log maintain kar sake
    'X-User-ID': tg.initDataUnsafe?.user?.id?.toString(),
    // Custom header to block direct browser requests
    'X-Requested-With': 'USG-Mini-App' 
  };
};

export const getTelegramUser = () => {
  return tg?.initDataUnsafe?.user || null;
};
