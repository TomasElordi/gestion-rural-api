import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PrismaOrganizationRepository {
  constructor(private prisma: PrismaService) {}

  async getOrganizationForUser(userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, deletedAt: null },
      select: {
        role: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!membership) return null;

    return {
      organization: membership.organization,
      membership: { role: membership.role },
    };
  }
}
