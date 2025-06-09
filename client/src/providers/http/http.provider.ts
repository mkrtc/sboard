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


    private async request<T>(method: RequestMethod, path: string, options?: RequestOptions): Promise<T>{
        const url = this.genPathParamsObj(path, options?.params);
        const {data} = await this._instance.request<T>({
            method,
            url,
            params: options?.query,
            data: options?.body
        })

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

    public get<T>(path: string, options?: Omit<RequestOptions, "body">){
        return this.request<T>("GET", path, options);
    }

    public post<T>(path: string, options?: RequestOptions){
        return this.request<T>("POST", path, options);
    }

    public put<T>(path: string, options?: RequestOptions){
        return this.request<T>("PUT", path, options);
    }


    public patch<T>(path: string, options?: RequestOptions){
        return this.request<T>("PATCH", path, options);
    }

    public delete<T>(path: string, options?: RequestOptions){
        return this.request<T>("DELETE", path, options);
    }
}