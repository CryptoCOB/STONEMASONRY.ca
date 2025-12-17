const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
}

async function apiRequest<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { method = 'GET', body, token } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  const authToken = token || localStorage.getItem('authToken');
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as unknown as TResponse;
  }

  return response.json() as Promise<TResponse>;
}

export function submitQuoteRequest(payload: {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
}): Promise<{ id: string }> {
  return apiRequest('/quote-requests', {
    method: 'POST',
    body: payload,
  });
}

export function submitEstimateRequest(payload: {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  timeline?: string;
  budget?: string;
  description: string;
  emergencyService: boolean;
}): Promise<{ id: string }> {
  return apiRequest('/estimates', {
    method: 'POST',
    body: payload,
  });
}

export default apiRequest;
