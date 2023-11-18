import { SetMetadata } from '@nestjs/common';
export const RESOURCE_DEF = '__resource_def__';

export const Resource = (options: { name: string; identify: string }) =>
  SetMetadata(RESOURCE_DEF, options);
