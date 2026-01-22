import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwt: JwtService) {}

  signAccess(payload: {
    sub: string;
    email: string;
    orgId?: string;
    role?: string;
  }) {
    return this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET!,
      expiresIn: process.env.JWT_ACCESS_TTL || ('15m' as any),
    });
  }

  signRefresh(payload: { sub: string; email: string }) {
    return this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: process.env.JWT_REFRESH_TTL || ('30d' as any),
    });
  }

  verifyRefresh(token: string) {
    return this.jwt.verify<{ sub: string; email: string }>(token, {
      secret: process.env.JWT_REFRESH_SECRET!,
    });
  }
}
