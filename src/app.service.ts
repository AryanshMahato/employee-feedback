import { Injectable } from '@nestjs/common';
import { HealthResponse } from './app.types';

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      mongoAlive: false,
      serverAlive: true,
    };
  }
}
