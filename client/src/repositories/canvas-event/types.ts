import { CanvasEventType } from "@/entities";


export interface MoveEvent{
    id: string;
    x: number;
    y: number;
}

export interface GetEventsFilter{
    /**@default 10 */
    take?: number;
    /**@default 0 */
    skip?: number;
    /**@default false */
    asc?: boolean;
    /**@default "created" */
    order?: string;
    createdFrom?: number;
    createdTo?: number;
    type?: CanvasEventType;
}