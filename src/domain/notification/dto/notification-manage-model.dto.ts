import { NotificationModelDto } from './notification-model.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { BaseModelDto } from '../../../common/dto/base.dto';

export class NotificationManageModelDto extends IntersectionType(NotificationModelDto, BaseModelDto) {}
