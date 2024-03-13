import { SetMetadata } from '@nestjs/common';
import { ObjectType } from 'typeorm';

export const ENTITY_REPOSITORY_DEF = '__entity_repository_def__';

export const EntityRepository = <T>(entity: ObjectType<T>): ClassDecorator =>
  SetMetadata(ENTITY_REPOSITORY_DEF, entity);
