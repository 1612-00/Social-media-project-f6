import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { GetUser } from '../../share/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../share/auth/guard/jwt.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { Roles } from 'src/share/decorators/user-roles.decorator';
import { UserRole } from './role/role.enum';
import { UserRolesGuard } from 'src/share/auth/guard/user-roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/confirm-account/:token')
  confirmAccount(@Param('token') token: string) {
    return this.userService.confirmAccount(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyInfo(@GetUser('id') id: string) {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  getUserById(@Param('userId') id: string) {
    return this.userService.getOtherUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-info')
  updateMyInfo(@GetUser('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateMyInfo(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, UserRolesGuard)
  @Roles(UserRole.Admin)
  @Delete('delete-user/:id')
  deleteUser(@Param('id') id: string, @GetUser('id') myId: string) {
    return this.userService.deleteUser(id, myId);
  }
}
