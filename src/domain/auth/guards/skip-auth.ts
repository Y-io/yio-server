import { SetMetadata } from '@nestjs/common';

export const IS_SHIP_AUTH_KEY = 'is_ship_auth';

/**
 * 跳过认证
 */
export const ShipAuth = () => SetMetadata(IS_SHIP_AUTH_KEY, true);
