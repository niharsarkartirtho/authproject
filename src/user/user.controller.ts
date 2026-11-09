import { Controller, Post,Body } from '@nestjs/common';
import { UserService } from './user.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() body:RegisterDto){
    //console.log("coming to controller");
    return this.userService.register(body)
  }

  @Post("login")
  login(@Body() body:LoginDto){
    return this.userService.login(body);
  }
}
