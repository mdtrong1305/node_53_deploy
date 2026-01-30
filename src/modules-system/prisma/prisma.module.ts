import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  // đăng ký các provider (service) mà module này cung cấp
  providers: [PrismaService],
  // cho phép các module khác có thể sử dụng các provider (service) được đăng ký trong module này
  exports: [PrismaService],
})
export class PrismaModule {}
