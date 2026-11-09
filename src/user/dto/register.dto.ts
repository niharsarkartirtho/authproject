import { IsString,IsNotEmpty, IsEmail } from "class-validator";
export class RegisterDto{

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    useremail:string;
    
    @IsString()
    @IsNotEmpty()
    username:string;

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsString()
    @IsNotEmpty()
    role:string;
}