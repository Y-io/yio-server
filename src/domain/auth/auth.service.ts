import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { SignInDto } from '@/domain/auth/dto/sign-in.dto';
import { User } from '@prisma/client';
import { hash, verify } from '@node-rs/argon2';
import { SignUpDto } from '@/domain/auth/dto/sign-up.dto';

export type UserClaim = Pick<User, 'id' | 'username'> & {
  hasPassword?: boolean;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: SignUpDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (user) throw new UnauthorizedException('账号已经存在');

    const hashedPassword = await hash(dto.password);

    return this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
      },
    });
  }

  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (!user) throw new UnauthorizedException('该账号微注册');
    let equal = false;
    try {
      equal = await verify(user.password, dto.password);
    } catch (e) {
      throw new UnauthorizedException('密码验证失败');
    }

    if (!equal) {
      throw new UnauthorizedException('密码错误');
    }

    return this.createToken(user.id, user.username);
  }

  async createToken(
    userId: string,
    account: string,
    options?: {
      expiresIn?: string;
    },
  ) {
    const secret = this.config.get('JWT_SECRET');
    const stringValue = options?.expiresIn || this.config.get('JWT_EXPIRES');

    const expiresIn = ms(stringValue);

    const token = await this.jwt.signAsync(
      {
        userId,
        account,
      },
      {
        expiresIn: stringValue,
        secret: secret,
      },
    );

    return {
      accessToken: token,
      expiresIn: expiresIn,
    };
  }
}
