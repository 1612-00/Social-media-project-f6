import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AppObject } from 'src/share/common';

export class CreateUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsEnum(AppObject.ROLE)
  role?: string = AppObject.ROLE.BASIC;
}
