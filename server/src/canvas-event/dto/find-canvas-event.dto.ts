import { Type } from "class-transformer";
import { CanvasEventEnum } from "../types";

export class FindCanvasEventDto{
    /**@default 10 */
    @Type(() => Number) 
    readonly take?: number;
    /**@default 0 */
    @Type(() => Number) 
    readonly skip?: number;
    /**@default false */
    readonly asc?: boolean;
    /**@default "created" */
    readonly order?: string;
    @Type(() => Number) 
    readonly createdFrom?: number;
    @Type(() => Number) 
    readonly createdTo?: number;
    readonly type?: CanvasEventEnum;
}