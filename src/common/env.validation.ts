import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';
import { createJwtKeyPair } from '@/common/utils/jwt-key-pair';
import { Algorithm, sign as jwtSign } from '@node-rs/jsonwebtoken';
import { getExpiresIn, getUtcTimestamp } from '@/domain/auth/services/auth.service';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  JWT_SERVER_ID: string;

  @IsNumber()
  JWT_LEEWAY: number;

  @IsString()
  @IsOptional()
  JWT_PRIVATE_KEY: string;

  @IsString()
  @IsOptional()
  JWT_PUBLIC_KEY: string;
}

const examplePrivateKey =
  '-----BEGIN PRIVATE KEY-----\n' +
  'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgSpFUI82zmYL8YX/z\n' +
  'fFYUJL/ZhkuRqywr9eeef4woqcahRANCAAS37SF+5FqNTd/aCXC+jPe6aZckfoq6\n' +
  'T7Gn+ibiNyXD9lHGlEgUZGLQmQmnqvQRNzBk9J/ekA1jIJbufg3Eo8LR\n' +
  '-----END PRIVATE KEY-----';

// const examplePublicKey =
//   '-----BEGIN PUBLIC KEY-----\n' +
//   'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE2eKpwfvlNBGhWOSF7ebfgZqfdkTq\n' +
//   '3YVv2HbTcl/K3qt2nfQZLLnJBvaSMXXisC6Xdh3HG0WOLrvdAnXHWV2IYg==\n' +
//   '-----END PUBLIC KEY-----';

export function envValidation(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  const { jwtPublicKey: JWT_PUBLIC_KEY, jwtPrivateKey: JWT_PRIVATE_KEY } =
    createJwtKeyPair(examplePrivateKey);

  return { ...validatedConfig, JWT_PRIVATE_KEY, JWT_PUBLIC_KEY };
}
