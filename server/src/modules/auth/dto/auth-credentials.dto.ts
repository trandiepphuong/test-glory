import { IsString, IsNotEmpty } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsString()
  password: string;
}
