import { Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

import { Request, Response } from 'express';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { REQUEST_ID } from '../constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');
  catch(exception: Error, host: ExecutionContextHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const timestamp = new Date().toISOString();
    if (host.getType() === 'http') {
      if (exception instanceof HttpException) {
        const requestId = request?.header(REQUEST_ID);
        const body = request.body;
        const query = request.query;

        const exceptionRes = exception.getResponse();

        const newResponse = {
          message: exception.message,
          error:
            typeof exceptionRes !== 'string'
              ? exceptionRes['error'] || exception.name
              : exception.name,
          method: request.method,
          url: request.url,
          statusCode: exception.getStatus(),
          timestamp,
        };

        const context = {
          ...newResponse,
          body,
          query,
          requestId,
        };

        this.logger.error(exception.message, exception.stack, context);
        response.status(exception.getStatus()).json(newResponse);
      }
    } else {
      response.status(500).json({
        statusCode: 500,
        error: exception['message'],
        timestamp,
      });
    }
  }
}
