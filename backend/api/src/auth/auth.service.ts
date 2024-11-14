import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { pbkdf2Sync, timingSafeEqual } from 'crypto';
import { isNull } from 'lodash';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  logout() {
    throw new Error('Method not implemented.');
  }

  async login(loginEmail: string, loginPasswd: string) {
    const user = await this.userService.findOneByEmail(loginEmail);

    if (isNull(user)) {
      throw new UnauthorizedException('email not found');
    }

    const { id, email, passwd, salt } = user;
    const encryptedHash = pbkdf2Sync(passwd, salt, 10000, 512, 'sha512');

    if (timingSafeEqual(loginPasswd, encryptedHash)) {
      return {
        accessToken: await this.jwtService.signAsync({ sub: id, email: email }),
      };
    } else {
      throw new UnauthorizedException('incorrect password');
    }
  }

  async signup(createUserDto: CreateUserDto) {
    const { id, email, passwd } = await this.userService.create(createUserDto);
    const accessToken = await this.login(email, passwd);
    return {
      id,
      ...accessToken,
    };
  }
}
