import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { v4 } from 'uuid';

import type { CallHandler, NestInterceptor, ExecutionContext } from '@nestjs/common';
import type { ServerResponse } from 'http';
import type { Observable } from 'rxjs';
import type { Request } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { LogLevel } from 'src/logger/types/log-entity.interface';
import { ApiSuccessResponse } from './api-success-response';

@Injectable()
export class ApiInterceptor implements NestInterceptor {

  constructor(private readonly loggerService: LoggerService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const log = this.loggerService.createLog({
      level: LogLevel.INFO,
      path: req.path,
      method: req.method,
      payload: {
        params: Object.keys(req.params).length ? JSON.parse(JSON.stringify(req.params)) : {},
        query: Object.keys(req.query).length ? JSON.parse(JSON.stringify(req.query)) : {},
        body: req.body || {}
      },
      ip: req.ip,
      start: new Date()
    });

    log.id = v4();
    req['log'] = log;

    return next.handle().pipe(map(async data => {
      const res = context.switchToHttp().getResponse<ServerResponse>();
      if (log) {
        log.end = new Date();
        await this.loggerService.saveLog(log);
      }
      return new ApiSuccessResponse(data, log.id, res.statusCode);
    }));
  }
}
