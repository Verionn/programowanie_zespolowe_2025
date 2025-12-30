import {RequestOptions} from "../types/CRUDTypes";

async function apiRequest<T>({
                                 method = "GET",
                                 url,
                                 data,
                                 headers = {},
                             }: RequestOptions): Promise<{ status: number; data: T }> {
    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: method !== "GET" && data ? JSON.stringify(data) : undefined,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || "An error occurred");
        }

        if (
            response.status === 204 ||
            response.headers.get("content-length") === "0"
        ) {
            return { status: response.status, data: {} as T };
        }

        const responseData: T = await response.json();
        return { status: response.status, data: responseData };
    } catch (error: any) {
        console.error(`Error in API request to ${url}:`, error.message);
        throw error;
    }
}

export const ApiService = {
    get: <T>(url: string, headers?: { [key: string]: string }) =>
        apiRequest<T>({ method: "GET", url, headers }),

    post: <T>(url: string, data: any, headers?: { [key: string]: string }) =>
        apiRequest<T>({ method: "POST", url, data, headers }),

    put: <T>(url: string, data: any, headers?: { [key: string]: string }) =>
        apiRequest<T>({ method: "PUT", url, data, headers }),

    delete: <T>(url: string, headers?: { [key: string]: string }) =>
        apiRequest<T>({ method: "DELETE", url, headers }),
};