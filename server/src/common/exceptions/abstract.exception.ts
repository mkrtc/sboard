import { HttpStatus } from "@nestjs/common";

import type { IAbstractException, TExceptionKeys } from "./exception.interface";


export abstract class AbstractException<C extends object = object> extends Error implements IAbstractException<C>{
    public readonly code: TExceptionKeys;
    public readonly reasons: string[];
    public readonly solutions: string[];
    public readonly context: C;
    public readonly statusCode: HttpStatus;

    constructor(value: Partial<IAbstractException<C>> & {message: string}){
        super(value.message)
        Object.assign(this, value);
    }

    getCode(): TExceptionKeys {
        return this.code;
    }
    getReasons(): string[] {
        return this.reasons;
    }
    getSolutions(): string[] {
        return this.solutions;
    }
    getContext(): C {
        return this.context;
    }
    getStatusCode(): HttpStatus {
        return this.statusCode;
    }
}