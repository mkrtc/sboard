import axios, { AxiosError, AxiosHeaderValue, AxiosInstance } from "axios";
import { ApiException, ApiSuccess, RequestMethod, RequestOptions } from "./http.types";
import { HTTP_CONFIG } from "./http.config";

export class HttpProvider{
    
    private readonly _baseUrl: string;
    private readonly _port: number | string;

    private readonly _instance: AxiosInstance;

    constructor(baseUrl: string = HTTP_CONFIG.baseUrl, port: number = HTTP_CONFIG.port){
        this._baseUrl = baseUrl;
        this._port = port;
        
        this._instance = axios.create({
            baseURL: `${this._baseUrl}:${this._port}`,
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
    }

    public setHeaders(headers: Record<string, AxiosHeaderValue>){
        this._instance.defaults.headers = {
            ...this._instance.defaults.headers,
            ...headers
        };

        return this;
    }


    private async request<T, C>(method: RequestMethod, path: string, options?: RequestOptions): Promise<ApiSuccess<T> | ApiException<C>>{
        const url = this.genPathParamsObj(path, options?.params);
        const {data} = await this._instance.request<ApiSuccess<T>>({
            method,
            url,
            params: options?.query,
            data: options?.body
        }).catch((err: AxiosError<ApiException<C>>) => {
            if (err.response?.data) {
              return { data: err.response.data };
            }
          
            return {
              data: {
                requestId: '',
                timestamp: new Date().toISOString(),
                data: null,
                reasons: ['Network error or unknown'],
                solutions: ['Check your connection'],
                code: 'NETWORK_ERROR',
                context: null as C,
                message: 'Network error or unknown',
                status: 'error',
                statusCode: 400
              } as ApiException<C>
            };
          });

        return data;
    }

    private genPathParamsObj(path: string, params?: object){
        if(!params) return path;

        for(const [key, value] of Object.entries(params)){
            console.log(key)
            path = path.replace(new RegExp(`:${key}`, "g"), value);
        }

        return path;
    }

    public get<T, C = object>(path: string, options?: Omit<RequestOptions, "body">){
        return this.request<T, C>("GET", path, options);
    }

    public post<T, C = object>(path: string, options?: RequestOptions){
        return this.request<T, C>("POST", path, options);
    }

    public put<T, C = object>(path: string, options?: RequestOptions){
        return this.request<T, C>("PUT", path, options);
    }


    public patch<T, C = object>(path: string, options?: RequestOptions){
        return this.request<T, C>("PATCH", path, options);
    }

    public delete<T, C = object>(path: string, options?: RequestOptions){
        return this.request<T, C>("DELETE", path, options);
    }
}