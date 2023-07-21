import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/RegisterDto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/LoginDto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async Register(body: RegisterDto) {
    try {
      const { email, lastname, name, password } = body;

      const UserExist = await this.prismaService.user.findFirst({
        where: { email },
      });

      if (UserExist) {
        throw new ConflictException('User already exist');
      }

      await this.prismaService.user.create({
        data: {
          email,
          lastname,
          name,
          password: await bcrypt.hash(password, 10),
        },
      });

      return {
        msg: 'User created',
      };
    } catch (error) {
      throw error;
    }
  }

  async Login(body: LoginDto, response: Response) {
    try {
      const { email, password } = body;

      const UserFound = await this.prismaService.user.findFirst({
        where: { email },
      });

      if (!UserFound) {
        throw new NotFoundException('User not found');
      }

      if (!(await bcrypt.compare(password, UserFound.password))) {
        throw new NotFoundException('Invalid Credentials');
      }

      const payload = { id: UserFound.id };
      const token = this.jwtService.sign(payload);
      response.cookie('token', token, {
        expires: new Date(Date.now() + 1000 * 3600 * 24 * 1),
      });

      return {
        msg: 'oK',
      };
    } catch (error) {
      throw error;
    }
  }
}
