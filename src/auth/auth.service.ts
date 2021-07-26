import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async login(user: any) {
    // return jwtDto : find user if exist return else create user
    const payload = { name: user.login };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
