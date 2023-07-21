import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getTokenCsrf(request: Request, response: Response) {}
}
