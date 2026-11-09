import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entites/user.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly UserRepo:Repository<User>,
        private readonly jwtService:JwtService,  //jwt service inject koro
    ){}
    
    async register(registerDto:RegisterDto){
        //console.log("coming to register function in service");
        const existingUser = await this.UserRepo.findOne({
            where:{useremail:registerDto.useremail},
        })
        if(existingUser){
            throw new ConflictException("email already registered");
        }

        const hashPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.UserRepo.create({
            username:registerDto.username,
            useremail:registerDto.useremail,
            password:hashPassword,
        });

        const saveUser = await this.UserRepo.save(user);

        const {password,...result} = saveUser; //password should never be seen

        return {
            message:"user registerd succesfully",
            user:result,
        };

    }

    async login(loginDto:LoginDto){
        const user = await this.UserRepo.findOne({
            where:{useremail:loginDto.useremail}
        })

        if(!user){
            throw new UnauthorizedException("Invalid email , email not found");
        }

        const isMatch = await bcrypt.compare(loginDto.password,user.password);

        if(!isMatch){
            throw new UnauthorizedException("Invalid  password ,password not matched");
        }

        //jwt generate korar ar jonno code
        const payload = {    //payload a id ar email rakha uchit not password
            sub:user.id,
            email:user.useremail
        };
        const accessToken = await this.jwtService.signAsync(payload);


        const {password,...result} = user;
        return{
            message:"user found",
            access_token:accessToken,
            user:result
        }
    }
}
