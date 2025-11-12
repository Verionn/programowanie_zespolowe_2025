const BASE_URL = 'https://api.example.com';

type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  headers?: { [key: string]: string };
  body?: any;
};

export async function fetchData<T>({
  method,
  endpoint,
  headers = {
    'Content-Type': 'application/json',
  },
  body,
}: RequestOptions): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
