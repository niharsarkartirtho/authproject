import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/jwt-auth/roles.guard.js';
// secret use kore token generate kora hoi..abar validation ar somoy ai secret key 
//ar sath a algorithm milay check kora hoi tai secret key lage
@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.registerAsync({         //token aar jonno configure kore nilam using secret key
    inject:[ConfigService],
    useFactory:(consfigService:ConfigService)=>{
      const secret = consfigService.get<string>('JWT_SECRET') // .env te ache
      if(!secret){
        throw new Error("JWT SECRET is not configured");
      }
      return{
        secret,
        signOptions:{
          expiresIn:'15m',
        }
      }
    }
  })],
  controllers: [UserController],
  providers: [UserService,JwtAuthGuard,RolesGuard], // jwtauthgaurd provider a dilam jate use korte pari
})
export class UserModule {}
