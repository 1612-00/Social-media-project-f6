import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  address: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  job?: string = '';
}
