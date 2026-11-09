import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    useremail:string;

    // @IsString()
    // @IsNotEmpty()
    // username:string;

    @IsString()
    @IsNotEmpty()
    password:string;
}