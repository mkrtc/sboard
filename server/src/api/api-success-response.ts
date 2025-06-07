import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";


export class ApiSuccessResponse<T = unknown> {
    public readonly data: T | null;
    @ApiProperty({type: "string", example: "success", default: "success", description: "Статус успешного ответа."})
    public readonly status: "success";
    @ApiProperty({type: "string", example: "a2c6dc8f-40af-436b-a5b1-04329ef02db8", description: "ID запроса. (Чтобы если вдруг что посмотреть в логах)"})
    public readonly requestId: string;
    @ApiProperty({type: "number", example: 200, description: "Код ответа."})
    public readonly statusCode: HttpStatus;
    @ApiProperty({type: "string", example: new Date(), description: "Время ответа."})
    public readonly timestamp: Date;


    constructor(data: T | null, requestId: string, statusCode: HttpStatus = HttpStatus.OK) {
        this.data = data;
        this.status = "success";
        this.requestId = requestId;
        this.statusCode = statusCode;
        this.timestamp = new Date();
    }

}