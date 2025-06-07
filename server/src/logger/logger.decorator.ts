import { Inject } from "@nestjs/common";
import { AbstractException } from "../common/exceptions";

import { LogLevel } from "./types/log-entity.interface";
import { LoggerService } from "src/logger/logger.service";

interface LogOptions{
    notReThrow?: boolean;
}

export const Log = (options?: LogOptions): MethodDecorator => {
    const injectLoggerService = Inject(LoggerService);

    return (target, propertyKey, descriptor: PropertyDescriptor) => {
        const method = descriptor.value!;
        injectLoggerService(target, 'loggerService');
        descriptor.value = async function (...args: any[]) {
            const loggerService = this.loggerService as LoggerService;
            
            const serviceName = this.constructor.name + "#" + propertyKey.toString();
            const log = loggerService.createLog<object>({
                level: LogLevel.INFO,
                message: `Start ${serviceName}#${propertyKey.toString()}`,
                payload: {args},
                service: serviceName,
                start: new Date()
            });
            try{                
                const data = await method.apply(this, args);
                log.payload = {args, result: data};
                await loggerService.saveLog(log);

                return data;
            }catch(err){
                console.log(err)

                const exception = err as AbstractException  <any>;

                log.level = LogLevel.ERROR;
                log.payload = {...log.payload || {}, err};
                log.end = new Date();
                log.stack = err.stack;
                log.code = exception.getCode();
                log.message = exception.message;

                await loggerService.saveLog(log);
                if(!options?.notReThrow){
                    throw err;
                }
            }
        }

    }
}