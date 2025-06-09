import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CanvasEventEnum, CanvasEventPayload } from '../types';

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
