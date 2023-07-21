import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/prot')
  prot() {
    return { msg: 'This route is protected' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/tokencsrf')
  protcrf(@Req() request: Request) {
    return { Token: request.csrfToken() };
  }
}
