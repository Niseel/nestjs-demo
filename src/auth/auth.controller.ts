import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  // @Req() request: Request

  // @Body('email') email: string,
  // @Body('password') password: string,
  register(@Body() authDTO: AuthDTO) {
    // body type must be a DTO
    console.log(authDTO);
    return this.authService.register(authDTO);
  }

  // [PATH] .../auth/login
  @Post('login')
  login(@Body() authDTO: AuthDTO) {
    // body type must be a DTO
    console.log(authDTO);
    return this.authService.login(authDTO);
  }
}
