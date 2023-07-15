import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies.token) {
      return req.cookies.token;
    }
    throw new UnauthorizedException('Invalid Authorization');
  }

  async validate(payload: { id: number; iat: number; exp: number }) {
    const { id } = payload;

    const userFound = this.prismaService.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!userFound) {
      throw new UnauthorizedException('Invalid Authorization');
    }

    return { userFound };
  }
}
