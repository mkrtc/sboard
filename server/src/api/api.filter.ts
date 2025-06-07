import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';


import type { Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { LogEntity } from '../logger/entities/log.entity';
import { AbstractException, TExceptionKeys } from 'src/common/exceptions';
import { ApiException } from './api-exception';
import { LogLevel } from 'src/logger/types/log-entity.interface';



@Catch()
export class ApiFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggerService: LoggerService
  ) { }

  public async catch(exception: HttpException | ApiException | AbstractException, host: ArgumentsHost) {
    const status: number = exception instanceof AbstractException ? exception.getStatusCode() : exception instanceof HttpException ? exception.getStatus() : 400;

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const log: LogEntity<any> = res.req['log'];
    
    const data: AbstractException | string = exception instanceof AbstractException ? exception : exception instanceof HttpException ? exception.getResponse()['message'] : (exception as Error).message;
    
    const responseBody =
    exception instanceof ApiException ? exception :
    data instanceof AbstractException ? new ApiException(data, log?.id || "") :
    new ApiException(data, log?.id || "", (status.toString() as TExceptionKeys), status);
    
    if (log) {
      log.end = new Date();
      log.level = LogLevel.ERROR;
      log.message = exception.message;
      log.stack = exception.stack;
      
      await this.loggerService.saveLog(log);
    }
    httpAdapter.reply(res, responseBody, status);

  }
}
