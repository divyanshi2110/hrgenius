const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('HRGENIUS_API_URL') || (window as any).__HRGENIUS_API_URL__;
    if (override) {
      return override.replace(/\/+$/, '');
    }

    // If running locally, route to local Spring Boot instance
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8081/api/v1';
    }
  }
  // Production cloud backend (Render)
  return 'https://hrgenius-backend.onrender.com/api/v1';
};

export const environment = {
  production: true,
  get apiUrl(): string {
    return getApiBaseUrl();
  }
};
