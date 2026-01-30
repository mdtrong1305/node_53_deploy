import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { TokenModule } from '../../modules-system/token/token.module.js';

@Module({
  // đăng ký import các module mà module này phụ thuộc vào
  imports: [TokenModule],
  // đăng ký controller xử lý các request
  controllers: [AuthController],
  // đăng ký các service cung cấp logic nghiệp vụ. Lưu ý: NestJS sẽ tự động new (khởi tạo instance) cho từng provider trong mảng này và inject vào các nơi cần thiết.
  providers: [AuthService],
})
export class AuthModule {}
