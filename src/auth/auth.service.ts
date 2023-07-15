import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/RegisterDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

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
}
