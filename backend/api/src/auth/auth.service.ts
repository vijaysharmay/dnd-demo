import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { pbkdf2Sync, timingSafeEqual } from 'crypto';
import { isNull } from 'lodash';
import { UserService } from 'src/user/user.service';

import { DIGEST, ITERATIONS, KEYLEN } from './constants';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  getCurrentUser(accessToken: string) {
    const { sub: id } = this.jwtService.decode(accessToken);
    return this.userService.findOne(id);
  }

  logout() {
    throw new Error('Method not implemented.');
  }

  async login(loginEmail: string, loginPasswd: string) {
    const user = await this.userService.findOneByEmail(loginEmail);

    if (isNull(user)) {
      throw new UnauthorizedException('email not found');
    }

    const { id, email, passwd, salt } = user;

    // Hash the login password with the same parameters
    const encryptedHash = pbkdf2Sync(
      loginPasswd,
      salt,
      ITERATIONS,
      KEYLEN,
      DIGEST,
    );

    // Convert both to Buffer and ensure they have the same length
    const storedPasswdBuffer = Buffer.from(passwd, 'hex');
    const loginHashBuffer = Buffer.from(encryptedHash);

    // Ensure both buffers are the same length
    if (storedPasswdBuffer.length !== loginHashBuffer.length) {
      throw new UnauthorizedException(
        'incorrect password - buffer length mismatch',
      );
    }

    // Compare securely using timingSafeEqual
    if (timingSafeEqual(storedPasswdBuffer, loginHashBuffer)) {
      return {
        id,
        accessToken: await this.jwtService.signAsync({ sub: id, email: email }),
      };
    } else {
      throw new UnauthorizedException('incorrect password');
    }
  }

  async signup(createUserDto: CreateUserDto) {
    const { email } = await this.userService.create(createUserDto);
    const accessToken = await this.login(email, createUserDto.passwd);
    return accessToken;
  }
}
