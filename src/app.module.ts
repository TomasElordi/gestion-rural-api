import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { FarmsModule } from './modules/farms/farms.module';
import { PaddocksModule } from './modules/paddocks/paddocks.module';
import { WaterPointsModule } from './modules/water-points/water-points.module';
import { HerdGroupsModule } from './modules/herd-groups/herd-groups.module';
import { GrazingEventsModule } from './modules/grazing-events/grazing-events.module';
import { InsightsModule } from './modules/insights/insights.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    FarmsModule,
    PaddocksModule,
    WaterPointsModule,
    HerdGroupsModule,
    GrazingEventsModule,
    InsightsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
