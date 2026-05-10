const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "development" ? "http://localhost:5000/api/v1" : "https://aditya-tallhari-portfolio.vercel.app/api/v1");

interface RequestOptions extends RequestInit {
  token?: string;
  body?: any;
}

export const apiClient = async (endpoint: string, options: RequestOptions = {}) => {
  const { token, body, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const isFormData = body instanceof FormData;
  if (isFormData) {
    // Let the browser set the boundary for FormData
    delete headers["Content-Type"];
  }

  const config: RequestInit = {
    ...rest,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) return null;

  return response.json();
};

export const api = {
  get: (endpoint: string, options?: RequestOptions) => 
    apiClient(endpoint, { ...options, method: "GET" }),
  
  post: (endpoint: string, body?: any, options?: RequestOptions) => 
    apiClient(endpoint, { ...options, method: "POST", body }),
  
  patch: (endpoint: string, body?: any, options?: RequestOptions) => 
    apiClient(endpoint, { ...options, method: "PATCH", body }),

  put: (endpoint: string, body?: any, options?: RequestOptions) => 
    apiClient(endpoint, { ...options, method: "PUT", body }),
  
  delete: (endpoint: string, options?: RequestOptions) => 
    apiClient(endpoint, { ...options, method: "DELETE" }),
};
