import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtDto } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validate(user: JwtDto) {
    return await this.userService.getUserById(user.id);
  }

  async sign(user: User) {
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(user: any) {
    const exist = await this.userService.getUserById(user.id);
    if (exist) return this.sign(exist);

    const newUser = new User();
    newUser.id = user.id;
    newUser.nickname = user.login;
    newUser.intraLogin = user.login;
    newUser.useTwoFactor = false;
    newUser.status = 0;
    newUser.avatar = user.image_url;
    newUser.ladderLevel = 0;
    newUser.ladderPoint = 0;
    await this.userService.createUser(newUser);

    return this.sign(newUser);
  }
}
