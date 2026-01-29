import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';

@Controller()
export class AppController {
  @Get('/health')
  healthyCheck(@Req() req: Request) {
    return {
      statusCode: 200,
      message: 'Server is healthy',
      data: {
        ip: req.ip,
        user_agent: req.get('user-agent'),
      },
    };
  }
}
