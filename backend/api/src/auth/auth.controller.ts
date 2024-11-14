import { Body, Controller, Post } from '@nestjs/common';

import { Public } from 'src/utils';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user-dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() authUserDto: AuthUserDto) {
    const { email, passwd } = authUserDto;
    return this.authService.login(email, passwd);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Public()
  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}
