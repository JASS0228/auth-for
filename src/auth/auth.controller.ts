import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/RegisterDto';
import { LoginDto } from './dto/LoginDto';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './user.decorator';
import { UserModel } from './types';

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  Profile(@User() user: UserModel) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  LogOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return { msg: 'Logout success' };
  }
}
