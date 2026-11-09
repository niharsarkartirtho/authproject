import { Controller, Post,Body, UseGuards, Req,Get, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/jwt-auth/roles.guard.js';
import { Roles } from '../auth/jwt-auth/roles.decorator.js';

type AuthenticatedRequest = Request & {  // type/ structure define korlam authenticate ta kemon dekte hobe
  user:{
    sub:number,  // for id
    email:string,
    iat:number, //khkn banano hoise
    exp:number //expire 
  } 
}

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

  @UseGuards(JwtAuthGuard)  // dummy code to test the gaurd is working
  @Get("profile")
  getprofile(@Req() req:AuthenticatedRequest){
    return {
      message:"Authenticated request succefully",
      user:{
        id:req.user.sub,
        email:req.user.email,
        iat : req.user.iat,
        expire:req.user.exp
      }
    }
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('admin')
  @Get('admin-data')
  GetAdminData(){
    return {
      message:"welcome Admin",
      data:"only admin can access this route"
    };
  }

}
