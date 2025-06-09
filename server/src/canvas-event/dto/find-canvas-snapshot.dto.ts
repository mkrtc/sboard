

export class FindCanvasSnapshotDto{
    readonly createdFrom?: number;
    readonly createdTo?: number;
    /**@default 10 */
    readonly take?: number;
    /**@default 0 */
    readonly skip?: number;
    readonly eventIds?: string[];
    readonly ids?: string[];
    /**@default false */
    readonly asc?: boolean;
    /**@default "created" */
    readonly order?: string;
}