import { HttpStatus } from "@nestjs/common";

export const ExceptionKeys = {
    UNKNOWN_EXCEPTION: "UNKNOWN_EXCEPTION",

    INCORRECT_LOGIN_OR_PASSWORD: "INCORRECT_LOGIN_OR_PASSWORD",
    PASSWORD_NOT_EQUALS: "PASSWORD_NOT_EQUALS",
    USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
    INCORRECT_AUTH_CODE: "INCORRECT_AUTH_CODE",
    AUTH_CODE_USED: "AUTH_CODE_USED",
    INCORRECT_AUTH_TOKEN: "INCORRECT_AUTH_TOKEN",
    UNAUTHORIZED: "UNAUTHORIZED",

    "400": "BAD_REQUEST_EXCEPTION",
    "401": "UNAUTHORIZED",
    "403": "FORBIDDEN_EXCEPTION",
    "404": "NOT_FOUND_EXCEPTION",
    "500": "INTERNAL_SERVER_ERROR_EXCEPTION",
    "503": "SERVICE_UNAVAILABLE_EXCEPTION",
    "504": "GATEWAY_TIMEOUT_EXCEPTION",
} as const;

export type TExceptionKeys = keyof typeof ExceptionKeys;

export interface IAbstractException<C extends object = object>{
    code: TExceptionKeys;
    reasons: string[];
    solutions: string[];
    context: C;
    statusCode: HttpStatus;
}