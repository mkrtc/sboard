import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { LogLevel } from "../types/log-entity.interface";


export class GetLogsDto{
    @ApiProperty({type: Boolean, description: "Сортировка по убыванию", default: false, required: false})
    @IsOptional()
    @Transform(({value}) => value === "true")
    @IsBoolean()
    readonly asc?: boolean;
    @ApiProperty({type: Number, description: "Количество логов (Макс 50)", required: false})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    readonly limit?: number;
    @ApiProperty({type: Number, description: "Смещение", required: false})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    readonly offset?: number;
    @ApiProperty({type: Number, description: "Дата от (мс)", required: false})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    readonly dateFrom?: number;
    @ApiProperty({type: Number, description: "Дата до (мс)", required: false})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    readonly dateTo?: number;
    @ApiProperty({enum: LogLevel, description: "Уровень лога", required: false})
    @IsOptional()
    @IsEnum(LogLevel)
    readonly level?: LogLevel;
    @ApiProperty({type: "string", description: "Название сервиса", required: false})
    @IsOptional()
    @IsString()
    readonly service?: string;
    @ApiProperty({type: "string", description: "Название метода", required: false})
    @IsOptional()
    @IsString()
    readonly method?: string;
    @ApiProperty({type: "string", description: "Код ошибки еси есть", required: false})
    @IsOptional()
    @IsString()
    readonly code?: string;
    @ApiProperty({type: Boolean, description: "Выводить payload", required: false})
    @IsOptional()
    @Transform(({value}) => value === "true")
    @IsBoolean()
    readonly withPayload?: boolean;
}