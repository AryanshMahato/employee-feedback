import { Injectable } from '@nestjs/common';
import { HealthResponse } from './app.types';

@Injectable()
export class AppService {
  getHello(): HealthResponse {
    return {
      mongoAlive: false,
      serverAlive: true,
    };
  }
}
