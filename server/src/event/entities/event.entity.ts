import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class EventEntity<T extends object = object> {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 255 })
  public type: string;

  @Column({type: "jsonb"})
  public data: T;

  @CreateDateColumn()
  public created: Date;

}
