import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsUUID } from "class-validator";


export class MoveFigureDto{
    @IsUUID("4")
    @IsNotEmpty()
    readonly id: string;
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    readonly x: number;
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    readonly y: number;
    @IsOptional()
    @IsUUID("4")
    readonly fromEventId?: string;
}