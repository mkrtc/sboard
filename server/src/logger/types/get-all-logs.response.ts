import { ApiProperty } from "@nestjs/swagger";
import { ILogEntity } from "./log-entity.interface";
import { LogEntity } from "src/logger/entities/log.entity";


export class GetAllLogsResponse<T = unknown>{
    @ApiProperty({type: LogEntity, isArray: true})
    rows: ILogEntity<T>[];
    @ApiProperty({type: "number", example: 0})
    count: number;
    @ApiProperty({type: "number", example: 0})
    pagination: number;
    @ApiProperty({type: "number", example: 0})
    page: number;
    @ApiProperty({type: "number", example: 0})
    left: number;
}