import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { ApiException } from "../api-exception";

import type { Type } from "@nestjs/common";
import type { ContentObject, HeadersObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

interface IApiResponse<GenericType> {
    description?: string;
    statusCode?: HttpStatus;
    type?: GenericType | GenericType[];
    isArray?: boolean;
    example?: any;
    headers?: HeadersObject;
}


const getDecorators = <GenericType extends Type<unknown>>(options: IApiResponse<GenericType>): Array<ClassDecorator | MethodDecorator | PropertyDecorator> => {
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [];
    if (options.type) {
        const tp = Array.isArray(options.type) ? options.type : [options.type];
        decorators.push(ApiExtraModels(ApiException, ...tp));
        decorators.push(ApiResponse({
            headers: options.headers,
            isArray: options.isArray || false,
            description: options.description,
            status: options.statusCode || HttpStatus.BAD_REQUEST,
            content: tp.reduce((cur, prev) => {
                return {
                    ...cur,
                    [prev.name]: {
                        schema: {
                            allOf: [
                                {$ref: getSchemaPath(ApiException)},
                                {properties: {
                                    data: {
                                        items: {
                                            $ref: getSchemaPath(prev)
                                        }
                                    }
                                }}
                            ]
                        }
                    }
                }
            }, {} as ContentObject)

        }));
    }


    return decorators;
};


export const ApiError = <GenericType extends Type<unknown>>(options: IApiResponse<GenericType>) => applyDecorators(
    ...getDecorators(options)
);

