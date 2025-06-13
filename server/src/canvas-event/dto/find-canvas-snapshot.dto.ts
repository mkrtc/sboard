import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsUUID } from "class-validator";


export class FindCanvasSnapshotDto{
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    readonly createdFrom?: number;
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    readonly createdTo?: number;
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    /**@default 10 */
    readonly take?: number;
    /**@default 0 */
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    readonly skip?: number;
    @IsOptional()
    @IsUUID("4", {each: true})
    readonly eventIds?: string[];
    @IsOptional()
    @IsUUID("4", {each: true})
    readonly ids?: string[];
    /**@default false */
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    readonly asc?: boolean;
    @IsOptional()
    @IsEnum(["created", "id"])
    /**@default "created" */
    readonly order?: string;
}