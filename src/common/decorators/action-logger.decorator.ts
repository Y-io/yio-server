import { SetMetadata } from '@nestjs/common';

export const USER_ACTION_LOG_DEF = '__user_action_log_def__';

export type ActionLoggerOptions = { template: string; keys: string[] };
export function ActionLogger(options: ActionLoggerOptions) {
  return SetMetadata(USER_ACTION_LOG_DEF, options);
}
