const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('HRGENIUS_API_URL') || (window as any).__HRGENIUS_API_URL__;
    if (override) {
      return override.replace(/\/+$/, '');
    }
  }
  // Default to local enterprise Spring Boot backend on port 8081
  return 'http://localhost:8081/api/v1';
};

export const environment = {
  production: true,
  get apiUrl(): string {
    return getApiBaseUrl();
  }
};
