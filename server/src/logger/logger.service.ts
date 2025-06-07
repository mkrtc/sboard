import { Injectable } from '@nestjs/common';
import { And, In, LessThan, MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { LogEntity } from './entities/log.entity';

import type { FindManyOptions, Repository } from 'typeorm';
import type { CreateLogDto } from './dto/create-log.dto';
import type { GetLogsDto } from './dto/get-logs.dto';


import { TExceptions } from './types/exceptions-name.type';

import { ILogEntity, LogLevel } from './types/log-entity.interface';
import { GetAllLogsResponse } from './types/get-all-logs.response';
import { UnknownException } from '../common/exceptions';


@Injectable()
export class LoggerService {

    @InjectRepository(LogEntity) private readonly logRepository: Repository<LogEntity>;

    constructor(

    ) { }

    public createLog<P = null>(log: CreateLogDto): LogEntity<P> {
        return this.logRepository.create(log) as LogEntity<P>;
    }

    public saveLog(log: LogEntity<any>) {
        return this.logRepository.save(log);
    }

    public getLogsByLevel<P = null>(level: LogLevel): Promise<LogEntity<P>[]> {
        return this.logRepository.find({ where: { level } }) as Promise<LogEntity<P>[]>;
    }

    public getLogsByLevels<P = null>(levels: LogLevel[]): Promise<LogEntity<P>[]> {
        return this.logRepository.find({ where: { level: In(levels) } }) as Promise<LogEntity<P>[]>;
    }

    public getLogById<P = null>(id: string): Promise<LogEntity<P> | null> {
        return this.logRepository.findOne({ where: { id } }) as Promise<LogEntity<P> | null>;
    }

    public async getAll<P = null>(dto: GetLogsDto): Promise<GetAllLogsResponse<P>> {
        const search: FindManyOptions<LogEntity> = {
            where: {
                level: dto.level,
                code: dto.code,
                service: dto.service,
                method: dto.method,
                created: dto.dateFrom && dto.dateTo ?
                    And(LessThan(new Date(dto.dateTo)), MoreThan(new Date(dto.dateFrom))) :
                    dto.dateFrom ? MoreThan(new Date(dto.dateFrom)) :
                        dto.dateTo ? LessThan(new Date(dto.dateTo)) : undefined,
            },
            order: {
                created: dto.asc ? 'ASC' : 'DESC'
            },
            take: dto.limit || 50,
            skip: dto.offset,
            select: {
                id: true,
                service: true,
                method: true,
                path: true,
                level: true,
                message: true,
                code: true,
                stack: true,
                ip: true,
                created: true,
                payload: dto.withPayload
            }
        }
        const rows = await this.logRepository.find(search) as ILogEntity<P>[];
        const count = await this.logRepository.count(search);
        const pagination = Math.ceil(count / (dto.limit || 50));
        const page = Math.floor((dto.offset || 0) / (dto.limit || 50));
        const left = pagination - page;

        return { rows, count, left, page, pagination }
    }

    private get exceptions() {
        return {
            UnknownException: new UnknownException,
        }
    }

    public getException(name: TExceptions) {
        return this.exceptions[name] || null;
    }

    public getExceptions() {
        return this.exceptions;
    }
}
