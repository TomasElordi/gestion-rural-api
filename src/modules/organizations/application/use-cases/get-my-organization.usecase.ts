import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaOrganizationRepository } from '../../infraestructure/repositories/prisma-organization.repository';

@Injectable()
export class GetMyOrganizationUseCase {
  constructor(private readonly orgRepo: PrismaOrganizationRepository) {}

  async execute(userId: string) {
    const result = await this.orgRepo.getOrganizationForUser(userId);

    if (!result) {
      throw new NotFoundException('User has no organization');
    }

    return result;
  }
}
