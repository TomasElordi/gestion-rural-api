import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
      ssl: {
        rejectUnauthorized: false, // Necesario para certificados de Supabase
        // Verifica que el hostname sea de Supabase para mayor seguridad
        checkServerIdentity: (host, cert) => {
          if (!host.includes('supabase.com')) {
            throw new Error('Invalid server hostname');
          }
          return undefined;
        },
      },
    });

    super({
      adapter: new PrismaPg(pool),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
