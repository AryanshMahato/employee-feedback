import { NotFoundException } from '@nestjs/common';

export class EnvConfig {
  static get databaseURL(): string {
    const databaseURL = process.env.DATABASE_URL;
    if (!databaseURL) {
      throw new NotFoundException();
    }
    return databaseURL;
  }
}
