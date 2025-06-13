import { IsOptional, IsUUID } from "class-validator";

export class CreateFigureDto{
    @IsOptional()
    @IsUUID("4")
    readonly fromEventId?: string;
}