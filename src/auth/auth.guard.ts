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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  private static getTokenFromBearerToken(bearerToken: string): string {
    if (!bearerToken.includes('Bearer')) {
      throw new UnauthorizedException('token is not bearer token');
    }

    const token = bearerToken.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('invalid bearer token format');
    }

    return token;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const bearerToken = request.headers.authorization;
    if (!bearerToken) {
      throw new UnauthorizedException('bearer token not found');
    }

    const token = AuthGuard.getTokenFromBearerToken(bearerToken);

    try {
      this.jwtService.verify<JWTPayload>(token);
    } catch (e) {
      throw new UnauthorizedException('jwt verification failed');
    }

    return true;
  }
}
