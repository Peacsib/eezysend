// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  'http://eezysend-nlb-871901cdb8bcb72b.elb.eu-west-1.amazonaws.com/eezysend';

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async post<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async put<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
}

export const api = new ApiClient(API_BASE_URL);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return api.post('/api/auth/login', { email, password });
  },
  
  register: async (data: {
    email: string;
    password: string;
    institution: string;
  }) => {
    return api.post('/api/auth/register', data);
  },
  
  logout: async (token: string) => {
    return api.post('/api/auth/logout', {}, token);
  },
};

// Documents API (placeholder - update based on actual Swagger endpoints)
export const documentsApi = {
  list: async (token: string) => {
    return api.get('/api/documents', token);
  },
  
  upload: async (formData: FormData, token: string) => {
    // Special handling for file uploads
    const url = `${API_BASE_URL}/api/documents/upload`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },
  
  download: async (documentId: string, token: string) => {
    return api.get(`/api/documents/${documentId}/download`, token);
  },
};
