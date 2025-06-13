import { WsException } from "@nestjs/websockets";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";


export const validateDto = async <T extends object>(cls: ClassConstructor<T>, data: any): Promise<T> => {
    const dto = plainToInstance(cls, data);
    const errors = await validate(dto);
    if(!errors.length) return dto;

    const message = errors.map(e => Object.values(e.constraints || "")).flat().join(', ');
    throw new WsException(message);
}