import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @MinLength(6)
  password: string;
}
/* 
  Se hace así porque tal vez en el futuro la información que se requiere en Create-User y Register-User 
  sea diferente
*/
