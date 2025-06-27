import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): User[] {
    return this.userService.findAll();
  }

  @Get(':id')
  getUser(@Param('id') id: string): User {
    const user = this.userService.findOne(+id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  createUser(@Body() userData: { name: string; email: string }): User {
    return this.userService.create(userData);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() userData: { name?: string; email?: string }
  ): User {
    const updatedUser = this.userService.update(+id, userData);
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): { message: string } {
    const deleted = this.userService.delete(+id);
    if (!deleted) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'User deleted successfully' };
  }
}