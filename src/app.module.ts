import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfig } from './config/EnvConfig';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(EnvConfig.databaseURL, {
      useNewUrlParser: true,
    }),
    TerminusModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
