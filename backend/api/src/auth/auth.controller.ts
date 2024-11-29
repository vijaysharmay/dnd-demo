import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { Public } from 'src/utils';

import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user-dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('auth/login')
  login(@Body() authUserDto: AuthUserDto) {
    const { email, passwd } = authUserDto;
    return this.authService.login(email, passwd);
  }

  @Post('auth/logout')
  logout() {
    return this.authService.logout();
  }

  @Get('me')
  getCurrentUser(@Headers('Authorization') authorizationHeader?: string) {
    if (!authorizationHeader)
      throw new Error('Couldnt find access token in header');
    const accessToken = authorizationHeader.split(' ')[1];
    return this.authService.getCurrentUser(accessToken);
  }

  @Post('liveblocks-auth')
  authLiveblocks(@Headers('Authorization') authorizationHeader?: string) {
    if (!authorizationHeader)
      throw new Error('Couldnt find access token in header');
    const accessToken = authorizationHeader.split(' ')[1];
    return this.authService.authLiveblocks(accessToken);
  }

  @Public()
  @Post('auth/signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}
