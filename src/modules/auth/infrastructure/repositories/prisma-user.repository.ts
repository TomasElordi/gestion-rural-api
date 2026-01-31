import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email, deletedAt: null } });
  }

  findById(id: string) {
    return this.prisma.user.findFirst({ where: { id, deletedAt: null } });
  }

  async createUserWithOrg(input: {
    email: string;
    fullName?: string;
    passwordHash: string;
    organizationName: string;
  }) {
    const { email, fullName, passwordHash, organizationName } = input;

    return this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: organizationName },
        select: { id: true },
      });
      const user = await tx.user.create({
        data: { email, fullName, passwordHash },
        select: { id: true },
      });

      await tx.membership.create({
        data: { organizationId: org.id, userId: user.id, role: 'owner' },
        select: { id: true },
      });

      return { userId: user.id, organizationId: org.id };
    });
  }

  async setRefreshTokenHash(userId: string, hash: string | null) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }

  async getOrganizationForUser(userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, deletedAt: null },
      select: { organizationId: true, role: true },
      orderBy: { createdAt: 'asc' },
    });
    return membership
      ? { organizationId: membership.organizationId, role: membership.role }
      : null;
  }
}
