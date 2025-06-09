import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CanvasEventEnum, CanvasEventPayload } from '../types';

// export type CanvasEventType = 'create' | 'move' | 'clear' | 'remove';

// interface CreateFigureEvent {
//   id: string;
//   x: number;
//   y: number;
//   color: string;
//   target: "square"; // "square" | "circle" | "triangle"
//   type: "create";
// }

// interface MoveEvent{
//   type: "move";
//   id: string;
//   x: number;
//   y: number;
// }

// interface ClearEvent{
//   type: "clear";
// }

// interface RemoveEvent{
//   type: "remove";
//   id: string;
// }

// export type CanvasEventPayload = CreateFigureEvent | MoveEvent | ClearEvent | RemoveEvent;

// export type EventPayloadByType<T extends CanvasEventType> = Extract<CanvasEventPayload, {type: T}>;

@Entity('events')
export class CanvasEventEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 255 })
  public type: CanvasEventEnum;

  @Column({ type: "jsonb" })
  public payload: CanvasEventPayload;

  @CreateDateColumn()
  public created: Date;

}
