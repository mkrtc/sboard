import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";


export class MoveFigureDto{
    @IsUUID("4")
    @IsNotEmpty()
    readonly id: string;
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber({allowNaN: false, allowInfinity: false})
    readonly x: number;
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber({allowNaN: false, allowInfinity: false})
    readonly y: number;
    @IsOptional()
    @IsUUID("4")
    readonly fromEventId?: string;
}