import { UserModel } from '../../domain/user/types';

export function formatUser(user: UserModel) {
  return {
    ...user,
    roles: user.roles.map((v) => v.role),
    organizations: user.organizations.map((v) => v.organization),
  };
}
