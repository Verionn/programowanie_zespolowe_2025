export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type RequestOptions = {
    method?: RequestMethod;
    url: string;
    data?: any;
    headers?: { [key: string]: string };
};