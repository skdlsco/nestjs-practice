import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FtGuard } from './guard/ft.auard';

@Controller('auth')
export class AuthController {
  @Get('ft')
  @UseGuards(FtGuard)
  async ftAuth(@Req() req) {
    return req.user;
  }
}
