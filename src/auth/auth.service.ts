import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken = async (
    username: string,
    email: string,
  ): Promise<string> => {
    const payload = { username, email } as JWTPayload;
    return this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
  };

  generateRefreshToken = async (
    username: string,
    email: string,
  ): Promise<string> => {
    const payload = { username, email } as JWTPayload;
    return this.jwtService.sign(payload, {
      expiresIn: '30d',
    });
  };
}
