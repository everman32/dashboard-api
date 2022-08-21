import { IsEmail, IsString } from "class-validator";

export class UserRegisterDto {
  @IsEmail({}, { message: "Invalid email" })
  email: string;

  @IsString({ message: "Name not specified" })
  name: string;

  @IsString({ message: "Password not specified" })
  password: string;
}
