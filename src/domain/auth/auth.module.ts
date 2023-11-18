import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '@/domain/auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@/domain/user/user.module';

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
