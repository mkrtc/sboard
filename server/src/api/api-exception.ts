import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { AbstractException, ExceptionKeys, TExceptionKeys } from "../common/exceptions";


export class ApiException<T extends object = object> extends Error{
    public readonly context: T;
    @ApiProperty({example: "error", type: "string", description: "Код ответа"})
    public readonly status: "error";
    @ApiProperty({example: "[Bad Request]", type: "string", description: "Сообщение ошибки"})
    public readonly message: string;
    @ApiProperty({example: "[date ISO]", type: "string", description: "Время ответа"})
    public readonly timestamp: Date;
    @ApiProperty({example: "[status code]", type: "number", description: "status code"})
    public readonly statusCode: HttpStatus;
    @ApiProperty({example: "[ERROR_CODE]", type: "string", description: "Код ошибки! Посмотреть все возможные ошибки можно по <b>/logger/exceptions<b/>"})
    public readonly code: string;
    @ApiProperty({example: "[uiid]", type: "string", description: "ID запроса. (Чтобы если вдруг что посмотреть в логах)"})
    public readonly requestId: string;
    @ApiProperty({example: "[reason]", type: "string", isArray: true, description: "Причины ошибки"})
    public readonly reasons: string[];
    @ApiProperty({example: "[solution]", type: "string", isArray: true, description: "Решения ошибки"})
    public readonly solutions: string[];

    constructor(exception: AbstractException<T>, requestId: string)
    constructor(exception: string, requestId: string, code: TExceptionKeys, statusCode: HttpStatus, data?: T)
    constructor(exception: AbstractException<T> | string, requestId: string, code: TExceptionKeys = "UNKNOWN_EXCEPTION", statusCode: HttpStatus = HttpStatus.BAD_REQUEST, data?: T){
        if(exception instanceof AbstractException){
            super(exception.message);
            this.statusCode = exception.getStatusCode();
            this.context = exception.getContext();
            this.message = exception.message;
            this.code = exception.getCode();
            this.reasons = exception.getReasons();
            this.solutions = exception.getSolutions();
        }else{
            super(exception);
            this.message = exception;
            this.context = data || ({} as T);
            this.statusCode = statusCode;
            this.code = ExceptionKeys[code];
            this.reasons = [];
            this.solutions = [];
        }

        this.status = "error";
        this.requestId = requestId;
        this.timestamp = new Date();
    }
}