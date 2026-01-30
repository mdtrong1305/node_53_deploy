import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules-api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { TokenModule } from './modules-system/token/token.module';
import { ArticleModule } from './modules-api/article/article.module';
import { CACHE_MANAGER, CacheModule, Cache } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { ProtectGuard } from './common/guards/protect.guard';
import { APP_GUARD } from '@nestjs/core';
import { SearchAppModule } from './modules-api/search-app/search-app.module';
import { ElasticSearchModule } from './modules-system/elastic-search/elastic-search.module';
import { OrderModule } from './modules-api/order/order.module';
import { RabbitMQModule } from './modules-system/rabbit-mq/rabbit-mq.module';
import { DATABASE_REDIS } from './common/constant/app.constant';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    PrismaModule,
    TokenModule,
    ArticleModule,
    CacheModule.register({ // cấu hình cache toàn cục sử dụng Redis
      isGlobal: true, // cho phép sử dụng cache ở mọi module
      stores: [new KeyvRedis(DATABASE_REDIS)], // cấu hình kết nối Redis
    }),
    SearchAppModule,
    ElasticSearchModule,
    OrderModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // đăng ký ProtectGuard làm global guard, để mọi api đi qua đều phải kiểm tra
    {
    provide: APP_GUARD,
    useClass: ProtectGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  // check kết nối cache khi khởi tạo module
  async onModuleInit() {
    try {
      await this.cacheManager.get('healthcheck');
      console.log('Redis cache is connected');
    } catch (error) {
      console.error('Redis cache connection error:', error);
    }
  }
}
