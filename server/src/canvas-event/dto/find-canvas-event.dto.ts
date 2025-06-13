import { Type } from "class-transformer";
import { CanvasEventEnum } from "../types";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class FindCanvasEventDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    /**@default 10 */
    readonly take?: number;
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    /**@default 0 */
    readonly skip?: number;
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    /**@default false */
    readonly asc?: boolean;
    /**@default "created" */
    @IsOptional()
    @IsString()
    readonly order?: string;
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    readonly createdFrom?: number;
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    readonly createdTo?: number;
    @IsOptional()
    @IsEnum(CanvasEventEnum)
    readonly type?: CanvasEventEnum;
}