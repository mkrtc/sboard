import { IsNotEmpty, IsUUID } from "class-validator";


export class DeleteFigureDto{
    @IsNotEmpty()
    @IsUUID("4")
    readonly id: string;
}