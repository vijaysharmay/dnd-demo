import { Liveblocks } from '@liveblocks/node';
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

  async authLiveblocks(accessToken: string) {
    const liveblocks = new Liveblocks({
      secret:
        'sk_dev_oiF9GToeuxyTnEr9INmx8YUQ_Q4nlLmn8nZbZDdJqxtOxx5bmuHw2qxw66H0l3_i',
    });

    // Get the current user from your database
    const user = await this.getCurrentUser(accessToken);
    const workspaces = user.workspaces.filter(
      (x) => !x.workspace.isUserWorkspace,
    );

    // Start an auth session inside your endpoint
    const session = liveblocks.prepareSession(user.fullName, {
      userInfo: { email: user.email, name: user.fullName, id: user.id },
    });

    for (const workspace of workspaces) {
      session.allow(`${workspace.workspace.id}:version:*`, session.FULL_ACCESS);
    }

    // Authorize the user and return the result
    const { body } = await session.authorize();
    return body;
  }

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
