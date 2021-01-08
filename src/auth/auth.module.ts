import { Module, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';

@Module({
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
})
export class AuthModule {
  static getTokenFromBearerToken(bearerToken: string): string {
    if (!bearerToken.includes('Bearer')) {
      throw new UnauthorizedException('token is not bearer token');
    }

    const token = bearerToken.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('invalid bearer token format');
    }

    return token;
  }
}
