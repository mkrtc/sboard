import { applyDecorators, HttpStatus, Type } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiBodyOptions, ApiExtraModels, ApiOperation, ApiParam, ApiParamOptions, ApiPropertyOptions, ApiQuery, ApiQueryOptions, ApiResponse, ApiResponseNoStatusOptions, getSchemaPath } from "@nestjs/swagger";
import { v4 } from "uuid";

import { ApiSuccessResponse } from "../api-success-response";

import type { HeadersObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

interface IApiResponse<GenericType> {
    summary?: string;
    description?: string;
    statusCode?: HttpStatus;
    type?: GenericType;
    isArray?: boolean;
    example?: any;
    headers?: HeadersObject;
    body?: Function | ApiBodyOptions;
    query?: Function | Function[] | ApiQueryOptions | ApiQueryOptions[];
    param?: [string, string] | ApiParamOptions;
    response?: ApiResponseNoStatusOptions;
    property?: ApiPropertyOptions;
    auth?: boolean;
}


const getDecorators = <GenericType extends Type<unknown>>(options: IApiResponse<GenericType>): Array<ClassDecorator | MethodDecorator | PropertyDecorator> => {
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [];
    if(options.type) {
        decorators.push(ApiExtraModels(ApiSuccessResponse<GenericType>, options.type));
        decorators.push(ApiResponse({
            headers: options.headers,
            status: options.statusCode || HttpStatus.OK, 
            schema: {
                description: options.description,
                example: options.example,
                allOf: [
                    { $ref: getSchemaPath(ApiSuccessResponse<GenericType>) },
                    {
                        properties: {
                            data: options.isArray ? {
                                type: 'array',
                                items: { $ref: getSchemaPath(options.type) }
                            } : { $ref: getSchemaPath(options.type) }
                        }
                    }
                ]
            }
        }));
    }

    if(options.response){
        decorators.push(ApiResponse(options.response))
    }

    if(options.body){
        if(options.body instanceof Function){
            decorators.push(ApiBody({type: () => options.body}))
        }else decorators.push(ApiBody({type: () => options.body}))
    }

    if(options.param){
        if(options.param instanceof Array){
            decorators.push(...options.param.map((param) => ApiParam({name: param[0], example: param[1]})))
        }else decorators.push(ApiParam(options.param));
    }

    if(options.query){
        if(Array.isArray(options.query)){
            options.query.forEach((query: Function | ApiParamOptions) => {
                if(query instanceof Function){
                    decorators.push(ApiQuery({type: () => query}))
                }else decorators.push(ApiQuery(query))
            })
        }else{
            if(options.query instanceof Function){
                decorators.push(ApiQuery({type: () => options.query}))
            }else decorators.push(ApiQuery(options.query))
        }
    }

    if(options.example){
        decorators.push(ApiResponse({
            headers: options.headers,
            status: options.statusCode || HttpStatus.OK,             
            schema: {
                description: options.description,
                example: options.example,
                allOf: [
                    { $ref: getSchemaPath(ApiSuccessResponse<GenericType>) },
                    {
                        properties: {
                            data: {
                                example: options.example
                            }
                        }
                    }
                ]
            }
        }))
    }

    if(options.auth){
        decorators.push(ApiBearerAuth("JWT-auth"))
    }


    return decorators;
};
export const ApiSuccess = <GenericType extends Type<unknown>>(options: IApiResponse<GenericType>) => applyDecorators(
    ApiOperation({ summary: options.summary, description: options.description, operationId: v4() }),
    ...getDecorators(options),
);


