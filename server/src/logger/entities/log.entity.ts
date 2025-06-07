import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn } from "typeorm";
import { ILogEntity, LogLevel } from "../types/log-entity.interface";



@Entity({name: "logs"})
export class LogEntity<P = unknown> implements ILogEntity<P>{
    @ApiProperty({type: "string", example: "uuid", description: "Уникальный ID лога"})
    @PrimaryColumn({type: "uuid"})
    @Generated("uuid")
    public id: string;

    @ApiProperty({type: "string", example: "service", description: "Сервис"})
    @Column({type: "varchar", length: 128, nullable: true})
    public service?: string;

    @ApiProperty({type: "string", example: "method", description: "Метод"})
    @Column({type: "varchar", length: 128, nullable: true})
    public method?: string;

    @ApiProperty({type: "string", example: "path", description: "Путь"})
    @Column({type: "varchar", length: 512, nullable: true})
    public path?: string;

    @ApiProperty({type: "string", example: "info", description: "Уровень лога"})
    @Column({type: "enum", enum: LogLevel, enumName: "log_level", default: LogLevel.INFO})
    public level: LogLevel;

    @ApiProperty({type: "string", example: "message", description: "Сообщение лога"})
    @Column({type: "text", nullable: true})
    public message?: string;

    @ApiProperty({type: "string", example: "code", description: "Код лога"})
    @Column({type: "varchar", length: 128, nullable: true})
    public code?: string;

    @ApiProperty({example: {}, description: "Объект ошибки"})
    @Column({type: "jsonb", nullable: true})
    public payload?: P;

    @ApiProperty({type: "string", example: "stack", description: "Стек ошибки"})
    @Column({type: "text", nullable: true})
    public stack?: string;

    @ApiProperty({type: "string", example: "ip", description: "IP адрес"})
    @Column({type: "varchar", length: 255, nullable: true})
    public ip?: string;

    @ApiProperty({type: "string", example: "2023-12-12T12:12:12.000Z", description: "Дата создания лога"})
    @CreateDateColumn({type: "timestamp"})
    public created: Date;

    @ApiProperty({type: "string", example: "2023-12-12T12:12:12.000Z", description: "Дата окончания лога"})
    @Column({type: "timestamp", nullable: true})
    public end?: Date | undefined;

    @ApiProperty({type: "string", example: "2023-12-12T12:12:12.000Z", description: "Дата начало лога"})
    @Column({type: "timestamp", nullable: true})
    public start?: Date | undefined;
}