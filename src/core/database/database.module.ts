import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  getDataSourceToken,
  TypeOrmModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

import { ENTITY_REPOSITORY_DEF } from './entity-repository.decorator';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvEnum } from '@/env.validation';

@Module({})
export class DatabaseModule {
  static forRoot(
    configRegister?: (() => TypeOrmModuleOptions) | TypeOrmModuleOptions,
  ): DynamicModule {
    return {
      global: true,
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const config =
              typeof configRegister === 'function'
                ? configRegister()
                : configRegister;

            return {
              type: 'postgres',
              username: configService.get('POSTGRES_USER'),
              password: configService.get('POSTGRES_PASSWORD'),
              database: configService.get('POSTGRES_DATABASE'),
              port: configService.get('POSTGRES_PORT'),
              synchronize: configService.get('MODE') === EnvEnum.Development,
              ...config,
            } as TypeOrmModuleOptions;
          },
        }),
      ],
    };
  }

  public static forCustomRepository<T extends new (...args: any[]) => any>(
    repositories: T[],
  ): DynamicModule {
    const providers: Provider[] = [];

    for (const repository of repositories) {
      const entity = Reflect.getMetadata(ENTITY_REPOSITORY_DEF, repository);

      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken()],
        provide: repository,
        useFactory: (dataSource: DataSource): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          return new repository(
            baseRepository.target,
            baseRepository.manager,
            baseRepository.queryRunner,
          );
        },
      });
    }

    return {
      exports: providers,
      module: DatabaseModule,
      providers,
    };
  }
}
