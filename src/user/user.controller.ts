import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async readUser() {
    return this.userService.getAllUser();
  }

  @Get(':id')
  async readUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Put()
  async updateUser(user: User) {
    return this.userService.updateUser(user);
  }

  @Delete()
  async deleteUser(@Req() req) {
    return this.userService.deleteUser(req.user);
  }

  @Post('friend/:id')
  async addFriend(@Req() req, @Param('id') friendId: number) {
    return this.userService.createFriend(req.user, friendId);
  }

  @Delete('friend/:id')
  async deleteFriend(@Req() req, @Param('id') friendId: number) {
    return this.userService.deleteFriend(req.user, friendId);
  }
}
