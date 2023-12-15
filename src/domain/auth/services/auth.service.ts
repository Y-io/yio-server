import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { hash, verify } from '@node-rs/argon2';
import { sign as jwtSign, verify as jwtVerify, Algorithm } from '@node-rs/jsonwebtoken';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { PrismaService } from '../../../prisma/prisma.service';

export type UserClaim = Pick<User, 'id' | 'username'>;

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private mailService: MailerService,
    private redisService: RedisService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (user) throw new UnauthorizedException('账号已经存在');

    const hashedPassword = await hash(dto.password);

    return this.prisma.user.create({
      data: { username: dto.username, password: hashedPassword },
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) throw new NotFoundException('该账号未注册');
    let equal = false;
    try {
      equal = await verify(user.password, dto.password);
    } catch (e) {
      throw new UnauthorizedException('密码验证失败');
    }

    if (!equal) {
      throw new UnauthorizedException('密码错误');
    }

    return this.createToken({
      id: user.id,
      username: user.username,
      // email: user.email,
    });
  }

  async sendEmailLoginCode(email: string) {
    await this.mailService.sendMail({
      subject: '登录验证码',
      from: {
        name: '系统邮件',
        address: this.configService.get('EMAIL_USER'),
      },
      to: email,
      template: 'login_code',
    });
  }

  async createToken(userClaim: UserClaim) {
    const expiresIn = getExpiresIn(this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'));
    const now = getUtcTimestamp();

    const token = await jwtSign(
      {
        data: userClaim,
        iat: now,
        exp: now + expiresIn,
        iss: this.configService.get('JWT_SERVER_ID'),
        sub: userClaim.id,
        aud: userClaim.username,
        jti: randomUUID({
          disableEntropyCache: true,
        }),
      },
      this.configService.get('JWT_PRIVATE_KEY'),
      {
        algorithm: Algorithm.ES256,
      },
    );

    return {
      accessToken: token,
      expiresIn: expiresIn,
    };
  }

  async refreshToken(userClaim: UserClaim) {
    const expiresIn = getExpiresIn(this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'));
    const now = getUtcTimestamp();

    return jwtSign(
      {
        data: userClaim,
        iat: now,
        exp: now + expiresIn,
        iss: this.configService.get('JWT_SERVER_ID'),
        sub: userClaim.id,
        aud: userClaim.username,
        jti: randomUUID({
          disableEntropyCache: true,
        }),
      },
      this.configService.get('JWT_PRIVATE_KEY'),
      {
        algorithm: Algorithm.ES256,
      },
    );
  }

  async verifyToken(token: string) {
    const jwtPublicKey = this.configService.get('JWT_PUBLIC_KEY');
    const jwtServerId = this.configService.get('JWT_SERVER_ID');
    const jwtLeeway = Number(this.configService.get('JWT_LEEWAY'));

    try {
      const data = (
        await jwtVerify(token, jwtPublicKey, {
          algorithms: [Algorithm.ES256],
          iss: [jwtServerId],
          leeway: jwtLeeway,
          requiredSpecClaims: ['exp', 'iat', 'iss', 'sub'],
        })
      ).data as UserClaim;
      return data;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
export const getUtcTimestamp = () => Math.floor(new Date().getTime() / 1000);
export const getExpiresIn = (value: string) => ms(value) / 1000;
