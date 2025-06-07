import { IncomingMessage } from "http";
import { LogEntity } from "src/logger/entities/log.entity";
import { getReqInDecorator } from "../../common/helpers";
import { AbstractException } from "../../common/exceptions";



interface ApiLogOptions{
    notSaveReturnData?: boolean;
    notSaveArgs?: boolean;
    message?: string;
}

export const ApiLog = (options?: ApiLogOptions): MethodDecorator => (target, propertyKey, descriptor: PropertyDescriptor) => {
    const method: Function = descriptor.value;
    
    const index = getReqInDecorator(target, propertyKey);
    
    descriptor.value = async function(...args: any[]){
        const req: IncomingMessage = args[index];
        const log: LogEntity = req['log'];
        
        log.service = target.constructor.name + "#" + propertyKey.toString();
        log.message = options?.message || log.message;
        try{
            const copyArgs = args.filter((_, i) => i !== index);

            if(!options?.notSaveArgs){
                log.payload = {...log.payload || {}, args: copyArgs};
            }

            const data: unknown = await method.apply(this, copyArgs);
            if(!options?.notSaveReturnData){
                log.payload = {...log.payload || {}, result: data};
            }

            return data;
        }catch(exception){
            if(exception instanceof AbstractException){
                log.message = exception.message;
                log.code = exception.getCode();
                log.stack = exception.stack;
                log.payload = {...log.payload || {}, meta: exception.getContext()};
            }

            throw exception;
        }
        
    }

    return descriptor;
}