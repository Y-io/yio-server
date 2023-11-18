import { SetMetadata } from '@nestjs/common';

export const IS_SKIP_AUTH_KEY = 'is_skip_auth';

/**
 * 跳过认证
 */
export const SkipAuth = () => SetMetadata(IS_SKIP_AUTH_KEY, true);
