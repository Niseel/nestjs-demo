import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Note } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2'; // hasdPassword
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(authDTO: AuthDTO) {
    // password must hashed
    const hashedPassword = await argon.hash(authDTO.password);

    try {
      // insert data to database
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          hashedPassword: hashedPassword,
          firstName: '',
          lastName: '',
        },
        // only select/return these fields
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      // You should add constraint unique email

      return {
        data: user,
        accessToken: (await this.signJwtToken(user.id, user.email)).accessToken,
        message: `Register User: ${authDTO.email} successfully!`,
      };
    } catch (error) {
      if (error.code == 'P2002') {
        throw new ForbiddenException('User with this email already exsited');
      }
      return {
        error,
      };
    }
  }

  async login(authDTO: AuthDTO) {
    // find user with input email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDTO.email,
      },
      // only select/return these fields
      select: {
        id: true,
        email: true,
        hashedPassword: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // verify password
    const passwordMatched = await argon.verify(
      user.hashedPassword,
      authDTO.password,
    );
    if (!passwordMatched) {
      throw new ForbiddenException('Incorrect Password');
    }

    delete user.hashedPassword;

    return {
      data: user,
      accessToken: (await this.signJwtToken(user.id, user.email)).accessToken,
      message: 'Login Successfully!',
    };
  }

  async convertObjectToJwtString(
    userId: number,
    email: string,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  async signJwtToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      accessToken: jwtString,
    };
  }
}
