import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }

  @Get('private')
  @UseGuards(AuthGuard(), UserRoleGuard)
  @SetMetadata('roles', ['admin', 'teacher'])
  testPrivate() {
    //@RawHeaders() headers: Headers //@GetUser() user: User
    //console.log("🚀 ~ :29 ~ AuthController ~ testPrivate ~ user:", user)
    return {
      ok: true,
      message: 'logged in',
    };
  }
}
