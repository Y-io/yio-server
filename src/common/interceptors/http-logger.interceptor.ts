import { CallHandler, Inject, Injectable, LoggerService, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Request } from 'express';
import _ from 'lodash';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

import { ActionLoggerOptions, USER_ACTION_LOG_DEF } from '../decorators';
import { AuthRequest } from '../guards';
import { REQUEST_ID } from '../constants';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContextHost, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        const actionOptions = this.reflector.get<ActionLoggerOptions>(USER_ACTION_LOG_DEF, context.getHandler());

        if (actionOptions) {
          const httpContext = context.switchToHttp();
          const httpRequest = httpContext.getRequest<Request>();

          const contextClass = context.getClass();
          const contextHandler = context.getHandler();

          const user = httpRequest['user'] as AuthRequest;

          const requestId = httpRequest?.header(REQUEST_ID);

          const compiled = _.template(actionOptions.template);
          const json = {};

          actionOptions.keys.forEach((key) => {
            json[key] = _.get(data, key, '');
          });

          const message = compiled(json);

          const url = httpRequest.url;
          const method = httpRequest.method;
          const body = httpRequest.body;
          const query = httpRequest.query;

          const info = {
            url,
            method,
            body,
            query,
            requestId,
            user: user,
            name: `${contextClass.name}-${contextHandler.name}`,
          };

          this.logger.log(message, 'ActionLogger', info);
        }
      }),
    );
  }
}
