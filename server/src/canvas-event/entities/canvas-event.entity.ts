import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface CanvasEventPayload {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

@Entity('events')
export class CanvasEventEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 255 })
  public type: string;

  @Column({ type: "jsonb", nullable: true })
  public payload: CanvasEventPayload[] | null;

  @CreateDateColumn()
  public created: Date;

}
