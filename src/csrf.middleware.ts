import { Injectable, NestMiddleware } from '@nestjs/common';
import { doubleCsrf } from 'csrf-csrf';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { generateToken } = doubleCsrf({
      getSecret: () => '121212131433',
      cookieName: 'x-csrf-token',
      cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        expires: new Date(Date.now() + 1000 * 3600 * 24 * 2),
      },
      size: 64,
      ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
      getTokenFromRequest: (req) => req.body?.csrfToken,
    });

    req.csrfToken = () => generateToken(res, req);
    next();
  }
}
