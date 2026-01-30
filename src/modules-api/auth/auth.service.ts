import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../../modules-system/token/token.service';

@Injectable() // đánh dấu class này là một service có thể inject vào các nơi khác
export class AuthService {
  // inject PrismaService và TokenService vào AuthService thông qua constructor
  constructor(private prisma: PrismaService, private tokenService: TokenService) {}

  async login(body: LoginDto) {
    const { email, password } = body;
    // Kiểm tra email người dùng có tồn tại trong db hay không
    // nếu mà tồn tại => đi tiếp
    // nếu mà chưa tồn => trả lỗi (Xin vui lòng đăng ký trước khi đăng nhập)
    const userExits = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (!userExits) {
      throw new BadRequestException("Xin vui lòng đăng ký trước khi đăng nhập");
      // throw new BadRequestException("Account Invalid")
    }
    if (!userExits.password) {
      throw new BadRequestException("Tài khoản không có mật khẩu, vui lòng đăng nhập bằng phương thức khác");
    }
    // kiểm tra password
    const isPassword = bcrypt.compareSync(password, userExits.password);
    if (!isPassword) {
      throw new BadRequestException("Mật khẩu chưa chính xác");
      // throw new BadRequestException("Account Invalid")
    }

    // Encrypt: MÃ HOÁ
    // mã hoá 2 chiều: CÓ THỂ DỊCH NGƯỢC

    const tokens = this.tokenService.createTokens(userExits.id);

    // console.log({ email, password, userExits });

    return tokens;
  }
}
