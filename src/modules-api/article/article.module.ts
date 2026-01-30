import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';

@Module({
  // đăng ký controller xử lý các request
  controllers: [ArticleController],
  // đăng ký các service cung cấp logic nghiệp vụ. Lưu ý: NestJS sẽ tự động new (khởi tạo instance) cho từng provider trong mảng này và inject vào các nơi cần thiết.
  providers: [ArticleService],
})
export class ArticleModule {}
