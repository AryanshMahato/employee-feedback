import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './auth.types';
import { AuthModule } from './auth.module';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const bearerToken = request.headers.authorization;
    if (!bearerToken) {
      throw new UnauthorizedException('bearer token not found');
    }

    const token = AuthModule.getTokenFromBearerToken(bearerToken);

    try {
      this.jwtService.verify<JWTPayload>(token);
    } catch (e) {
      throw new UnauthorizedException('jwt verification failed');
    }

    return true;
  }
}
