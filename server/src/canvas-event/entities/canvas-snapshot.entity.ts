import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CanvasEventEntity } from "./canvas-event.entity";

export interface Figure{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

@Entity("canvas-snapshots")
export class CanvasSnapshotEntity{
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({type: "jsonb"})
    public state: Figure[];

    @CreateDateColumn()
    public created: Date;

    @Column({type: "uuid", nullable: true})
    public eventId: string;

    @OneToOne(() => CanvasEventEntity, (event) => event.id, {onDelete: "CASCADE"})
    @JoinColumn({name: "event_id"})
    public event: CanvasEventEntity;
}