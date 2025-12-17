const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
const PUBLIC_API_KEY = process.env.REACT_APP_PUBLIC_API_KEY;

export async function postJson<T>(path: string, body: unknown, opts?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(PUBLIC_API_KEY ? { 'x-api-key': PUBLIC_API_KEY } : {}),
      ...(opts?.headers || {})
    },
    body: JSON.stringify(body),
    ...opts
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return response.json() as Promise<T>;
}
