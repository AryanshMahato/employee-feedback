import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { RedisModule } from '../redis/redis.module';
import { AuthService } from './auth.service';

export const AuthModuleMock = Test.createTestingModule({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: EnvConfig.jwtSecret,
    }),
    RedisModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
});
