import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../../modules-system/token/token.service';
import { TokenExpiredError } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../modules-system/prisma/prisma.service';

@Injectable()
export class ProtectGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // lấy cờ isPublic trong mọi api để xem xem có được đánh true hay không
    // nếu api nào có @Public() thì cờ isPublic sẽ là true
    // nếu cờ không đánh undefine => cho code chạy tiếp đi kiểm tra
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // nhìn thấy là api public thì cho qua luôn
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // 💡 Khóa bí mật JWT dùng để xác thực payload
      // chính là khóa đã truyền vào trong JwtModule
      const payload = await this.tokenService.verifyAccessToken(token);
      // 💡 Gán payload vào đối tượng request
      // để có thể truy cập trong các route handler
      // kiểm tra userId có tồn tại trong db ko
      const userExits = await this.prisma.users.findUnique({
        where: {
          id: (payload as any).userId,
        },
      });
      if (!userExits) {
        throw new UnauthorizedException("Không tìm thấy user");
      }
      request['user'] = userExits;
    } catch (err){
      // sử lý lỗi khi xác thực token
      switch (err.constructor) {
        case TokenExpiredError:
          // token hết hạn: 403 (FE gọi api refresh token để lấy token mới)
          throw new ForbiddenException(err.message);
        default:
          // mọi lỗi còn lại của token: 401 (FE-logout)
          throw new UnauthorizedException(err.message);
      }
    }
    return true;
  }
  // hàm lấy token từ header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
