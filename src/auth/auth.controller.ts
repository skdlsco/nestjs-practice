import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from './guard/ft.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('ft')
  @UseGuards(FtGuard)
  async ftAuth(@Req() req) {
    return this.authService.login(req.user);
  }
}
