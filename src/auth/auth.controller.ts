import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/RegisterDto';
import { LoginDto } from './dto/LoginDto';
import { Request, Response, response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { request } from 'http';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  Register(@Body() body: RegisterDto) {
    return this.authService.Register(body);
  }

  @Post('login')
  Login(
    @Body() Body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.Login(Body, response);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  Profile(@Req() request: Request) {
    return this.authService.profile(request);
  }
}
