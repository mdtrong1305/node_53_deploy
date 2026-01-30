import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";

@Module({
    // đăng ký các provider (service) mà module này cung cấp
    providers: [TokenService],
    // cho phép các module khác có thể sử dụng các provider (service) được đăng ký trong mảng này
    exports: [TokenService]
})
export class TokenModule {}