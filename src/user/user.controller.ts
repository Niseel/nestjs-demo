import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express'; // <-- Go with nest
import { GetUser } from '../auth/decorator'
import { MyJwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  // [PATH] .../users/me
  // @UseGuards(AuthGuard('jwt')) // <-- Default
  @UseGuards(MyJwtGuard) // <-- Custom Guard
  @Get('me')
  // me(@Req() request: Request) {
  me(@GetUser() user: User) {
    // <-- Apply Custom @Decorator
    // console.log(request.user); // <- where this come from? validate jwt strategy
    // Need Guards to protect
    return user;
  }
}
