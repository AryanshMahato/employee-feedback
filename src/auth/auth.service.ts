import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken = async (username: string): Promise<string> => {
    const payload = { username };
    return this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
  };

  generateRefreshToken = async (username: string): Promise<string> => {
    const payload = { username };
    return this.jwtService.sign(payload, {
      expiresIn: '30d',
    });
  };
}
