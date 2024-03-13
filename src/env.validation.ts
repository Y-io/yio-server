import { plainToInstance, Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { createJwtKeyPair } from '@/utils/create-jwt-key-pair';

export enum EnvEnum {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
}

class EncConfigVariables {
  @IsEnum(EnvEnum)
  NODE_ENV: EnvEnum;

  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  PORT: number;
  @IsString()
  SERVER_ID: string;

  @IsString()
  JWT_SECRET: string;
  @IsString()
  JWT_ACCESS_TOKEN_EXPIRES_IN: string;
  @IsString()
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  JWT_LEEWAY: number;
  @IsString()
  @IsOptional()
  JWT_PRIVATE_KEY: string;
  @IsString()
  @IsOptional()
  JWT_PUBLIC_KEY: string;

  @IsString()
  REDIS_HOST: string;
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  REDIS_PORT: number;
  @IsString()
  REDIS_URL: string;

  @IsString()
  POSTGRES_USER: string;
  @IsString()
  POSTGRES_PASSWORD: string;
  @IsString()
  POSTGRES_HOST: string;
  @IsString()
  POSTGRES_PORT: string;
  @IsString()
  POSTGRES_DATABASE: string;
  @IsString()
  DATABASE_URL: string;

  @IsString()
  @IsOptional()
  EMAIL_USER: string;
  @IsString()
  @IsOptional()
  EMAIL_PASS: string;
}

const examplePrivateKey =
  '-----BEGIN PRIVATE KEY-----\n' +
  'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgSpFUI82zmYL8YX/z\n' +
  'fFYUJL/ZhkuRqywr9eeef4woqcahRANCAAS37SF+5FqNTd/aCXC+jPe6aZckfoq6\n' +
  'T7Gn+ibiNyXD9lHGlEgUZGLQmQmnqvQRNzBk9J/ekA1jIJbufg3Eo8LR\n' +
  '-----END PRIVATE KEY-----';

export function envValidation(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EncConfigVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  const { jwtPublicKey: JWT_PUBLIC_KEY, jwtPrivateKey: JWT_PRIVATE_KEY } =
    createJwtKeyPair(examplePrivateKey);

  return {
    ...validatedConfig,
    JWT_PRIVATE_KEY,
    JWT_PUBLIC_KEY,
    DATABASE_URL: `postgresql://${validatedConfig.POSTGRES_USER}:${validatedConfig.POSTGRES_PASSWORD}@${validatedConfig.POSTGRES_HOST}:${validatedConfig.POSTGRES_PORT}/${validatedConfig.POSTGRES_DATABASE}?schema=public`,
    REDIS_URL: `redis://${validatedConfig.REDIS_HOST}:${validatedConfig.REDIS_PORT}`,
  };
}
