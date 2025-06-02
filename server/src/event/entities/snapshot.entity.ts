import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("snapshots")
export class SnapshotEntity<T extends object = object>{
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({type: "jsonb"})
    public state: T;

    @CreateDateColumn()
    public created: Date;
}