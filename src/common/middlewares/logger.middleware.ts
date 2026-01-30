import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();

    this.logger.log(`${method} ${originalUrl} - IP: ${ip}`);

    const cleanUp = () => {
      res.removeListener('finish', logResponse);
      res.removeListener('close', logResponse);
    };

    const logResponse = () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || '-';
      const duration = Date.now() - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} bytes - ${duration}ms`,
      );

      cleanUp();
    };

    res.on('finish', logResponse);
    res.on('close', logResponse);

    next();
  }
}
