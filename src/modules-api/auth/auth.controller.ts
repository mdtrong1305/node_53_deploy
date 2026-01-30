import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@Controller('auth') // định nghĩa route api này là /auth 
export class AuthController {
  // inject service đã đăng ký provider trong module
  constructor(private authService: AuthService) {} 

  // định nghĩa route /auth/login với phương thức POST
  @Post('login')
  // đánh dấu phương thức này là public (không cần token để truy cập)
  @Public()
  // phương thức xử lý khi có request đến /auth/login 
  login(
    @Body() body: LoginDto // lấy dữ liệu từ body của request
  ) {
    console.log('body', body);
		const result = this.authService.login(body);
    return result;
  }
}
