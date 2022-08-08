import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AppObject } from 'src/share/common';
import { UserRole } from '../role/role.enum';

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
  @IsEnum(UserRole)
  role?: string = UserRole.User;
}
