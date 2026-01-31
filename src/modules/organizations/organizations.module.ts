import { Module } from '@nestjs/common';
import { OrganizationsController } from './presentation/organizations.controller';
import { GetMyOrganizationUseCase } from './application/use-cases/get-my-organization.usecase';
import { PrismaOrganizationRepository } from './infraestructure/repositories/prisma-organization.repository';

@Module({
  controllers: [OrganizationsController],
  providers: [PrismaOrganizationRepository, GetMyOrganizationUseCase],
})
export class OrganizationsModule {}
