// import 'reflect-metadata';

export const PERMISSION_DEF = '__permission_def__';

export type PermissionAction = 'create' | 'delete' | 'update' | 'find';

export function Permission(options: { name: string; identify: string; action: PermissionAction }) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(PERMISSION_DEF, options, target, propertyKey);
  };
}
