import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

// khuyến khích nên sử dụng DTO để định nghĩa cấu trúc dữ liệu cho các request và response trong ứng dụng NestJS
// tận dụng điểm mạnh của nestjs trong việc sử dụng class
export class LoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
