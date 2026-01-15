import { RequestOptions } from "../types/CRUDTypes";


async function apiRequest<T>({ method = 'GET', url, data, headers = {} }: RequestOptions): Promise<T> {
    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred');
        }

        
        if (response.status !== 204) {
            return await response.json();
        }
        return {} as T;
    } catch (error: any) {
        console.log(`Error in API request to ${url}:`, error.message);
        throw error;
    }
}


export const ApiService = {
    get: <T>(url: string, headers?: { [key: string]: string }) => 
        apiRequest<T>({ method: 'GET', url, headers }),
    
    post: <T>(url: string, data: any, headers?: { [key: string]: string }) => 
        apiRequest<T>({ method: 'POST', url, data, headers }),
    
    put: <T>(url: string, data: any, headers?: { [key: string]: string }) => 
        apiRequest<T>({ method: 'PUT', url, data, headers }),
    
    delete: <T>(url: string, headers?: { [key: string]: string }) => 
        apiRequest<T>({ method: 'DELETE', url, headers }),
};