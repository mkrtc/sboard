import { HttpStatus } from "@nestjs/common";
import { AbstractException } from "./abstract.exception";


export class UnknownException<C extends object = object> extends AbstractException<C> {

    constructor(context?: C) {
        super({
            message: "Неизвестная ошибка",
            code: "UNKNOWN_EXCEPTION",
            context,
            statusCode: HttpStatus.BAD_REQUEST,
            reasons: [
                "Неизвестная ошибка"
            ],
            solutions: [
                "Попробуйте позже"
            ]

        });
    }
}