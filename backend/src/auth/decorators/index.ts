import { SetMetadata } from '@nestjs/common';

// Define the roles
export const ROLES_KEY = 'roles';
export type Role = 'ADMIN' | 'CAJERO' | 'ANALISTA';

// Create a decorator that takes an array of roles as an argument
export const Roles = (roles: Role[]) => SetMetadata(ROLES_KEY, roles);