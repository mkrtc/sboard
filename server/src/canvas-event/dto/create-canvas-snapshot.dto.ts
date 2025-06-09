import { Figure } from "../entities/canvas-snapshot.entity";


export class CreateCanvasSnapshotDto{
    readonly state: Figure[];
    readonly eventId: string;
}