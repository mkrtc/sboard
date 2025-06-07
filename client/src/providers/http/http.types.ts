
export type RequestMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

export interface RequestOptions{
    query?: object;
    params?: object;
    body?: object;
}


export interface ApiSuccess<T = object> {
    data: T;
    status: "success",
    requestId: string;
    statusCode: number;
    timestamp: string;
}

export interface ApiException<C = object> {
    message: string;
    context: C;
    status: "error";
    timestamp: string;
    statusCode: number;
    code: string;
    requestId: string;
    reasons: string[];
    solutions: string[];
}