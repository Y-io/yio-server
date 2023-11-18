import 'reflect-metadata';

// import { SetMetadata } from '@nestjs/common';

export const PERMISSION_DEF = '__permission_def__';
//
// export const Permission = (options: {
//   name: string;
//   identify: string;
//   action: 'create' | 'delete' | 'update' | 'find';
// }) => SetMetadata(PERMISSION_DEF, options);

export type PermissionAction = 'create' | 'delete' | 'update' | 'find';

export function Permission(options: { name: string; identify: string; action: PermissionAction }) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(PERMISSION_DEF, options, target, propertyKey);
  };
}
