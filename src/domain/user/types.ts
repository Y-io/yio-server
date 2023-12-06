import { PromiseType } from 'prisma/prisma-client/scripts/default-index';
import { GetResult } from 'prisma/prisma-client/runtime/library';
import { Prisma } from '@prisma/client';

export type UserModel = PromiseType<
  Prisma.Prisma__UserClient<
    GetResult<
      Prisma.$UserPayload,
      {
        include: {
          roles: {
            include: {
              role: true;
            };
          };
          organizations: {
            include: {
              organization: true;
            };
          };
        };
      },
      'findUnique'
    >
  >
>;
