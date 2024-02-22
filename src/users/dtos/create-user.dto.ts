import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  //todo: add more validations later after testingS
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
