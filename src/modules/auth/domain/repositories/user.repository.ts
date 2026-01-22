import { User } from '@prisma/client';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;

  abstract createUserWithOrg(input: {
    email: string;
    fullName?: string;
    passwordHash: string;
    organizationName: string;
  }): Promise<{ userId: string; organizationId: string }>;

  abstract setRefreshTokenHash(
    userId: string,
    hash: string | null,
  ): Promise<void>;

  abstract getOrganizationForUser(
    userId: string,
  ): Promise<{ organizationId: string; role: string } | null>;
}
