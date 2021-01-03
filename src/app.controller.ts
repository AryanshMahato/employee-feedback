import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HealthResponse } from './app.types';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @HttpCode(200)
  getHealth(): HealthResponse {
    const health = this.appService.getHealth();

    // Server and mongo is alive
    if (health.serverAlive && health.mongoAlive) {
      return health;
    }

    throw new InternalServerErrorException(health);
  }
}
