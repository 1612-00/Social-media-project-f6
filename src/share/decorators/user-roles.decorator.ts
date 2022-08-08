import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/api/user/role/role.enum';

export const USER_ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(USER_ROLES_KEY, roles);
