import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { UnknownException } from '../common/exceptions';
import { TExceptions } from './types/exceptions-name.type';
import { GetLogsDto } from './dto/get-logs.dto';
import { LogEntity } from './entities/log.entity';
import { LoggerService } from './logger.service';
import { ApiSuccess } from 'src/api/decorators/api-success.decorator';
import { ApiLog } from 'src/api/decorators/api-log.decorator';

@Controller('log')
export class LoggerController {
    constructor(private readonly loggerService: LoggerService) {}

    @ApiSuccess({summary: "Получить логи", type: LogEntity, isArray: true, query: GetLogsDto})
    @Get()
    @ApiLog({notSaveReturnData: true})
    public async getLogs(@Query() dto: GetLogsDto){
        console.log(12)
        return await this.loggerService.getAll(dto);
    }

    @ApiSuccess({summary: "Получить лог по id", type: LogEntity, query: {name: "id"}})
    @Get("by-id")
    @ApiLog({notSaveReturnData: true})
    public async getLogById(@Query("id", new ParseUUIDPipe({version: "4"})) id: string){
        return await this.loggerService.getLogById(id);
    }

    @ApiSuccess({summary: "Получить все ошибки", type: UnknownException})
    @Get("/exceptions")
    @ApiLog({notSaveReturnData: true})
    public getExceptions(){
        return this.loggerService.getExceptions(); 
    }

    @ApiSuccess({summary: "Получить ошибку по названию", type: UnknownException, param: {name: "name", type: "string"}})
    @Get("/exception/:name")
    @ApiLog({notSaveReturnData: true})
    public getException(@Param("name") name: TExceptions){
        return this.loggerService.getException(name); 
    }
}
