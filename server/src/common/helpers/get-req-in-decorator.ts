import "reflect-metadata";
import { Req } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";

interface RoutArgsData {
    [key: string]: {
        index: number;
        data: any;
    }
}

/**
 * !!!IMPORTANT use only in method decorator from Controller
 * 
 * @example
 * ```ts
 * *@Controller()
 * class MyClass{
 *  *@Get()
 *  *@CustomDecorator()
 *  get(){
 *     ...
 *  }
 * }
 * 
 * // const CustomDecorator = (): MethodDecorator => {
 *  return (target, propertyKey, descriptor) => {
 *      const method: Function = descriptor.value;
 * 
 *      const index = getReqInDecorator(target, propertyKey);
 * 
 *      descriptor.value = function(...args: any[]){
 *          const req = args[index];
 *          const copyArgs = [...args].filter(arg => !(typeof arg === "object" && arg instanceof IncomingMessage));
 *          ...
 *          return method.apply(this, copyArgs);
 *      }
 *  }
 * }
 * ```
 */
export const getReqInDecorator = (target: object, propertyKey: string | symbol) => {
    const methodArgs: RoutArgsData | undefined = Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, propertyKey);
        
    let index = 0;
    if(methodArgs){
        index = Object.keys(methodArgs).length;
    }
    Req()(target, propertyKey, index);
    return index;
}