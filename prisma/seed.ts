import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log('🌱 Seeding database...');

  // Crear usuario de prueba
  const passwordHash = await argon2.hash('password123');

  const user = await prisma.user.upsert({
    where: { email: 'test@gestionrural.com' },
    update: {},
    create: {
      email: 'test@gestionrural.com',
      fullName: 'Usuario de Prueba',
      passwordHash,
    },
  });

  console.log('✅ Usuario creado:', user.email);

  // Crear organización
  const org = await prisma.organization.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Establecimiento Demo',
    },
  });

  console.log('✅ Organización creada:', org.name);

  // Crear membership (vincular usuario con org)
  const membership = await prisma.membership.upsert({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      userId: user.id,
      role: 'owner',
    },
  });

  console.log('✅ Membership creado: role =', membership.role);

  // Crear farm de prueba
  const farm = await prisma.$queryRaw<any[]>`
    INSERT INTO "farms" (id, organization_id, name, center, created_at, updated_at)
    VALUES (
      '00000000-0000-0000-0000-000000000002'::uuid,
      ${org.id}::uuid,
      'Campo Demo',
      ST_SetSRID(ST_MakePoint(-58.123, -34.456), 4326),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING
    RETURNING id::text, name
  `;

  if (farm.length > 0) {
    console.log('✅ Farm creado:', farm[0].name);
  } else {
    console.log('ℹ️  Farm ya existía');
  }

  console.log('\n🎉 Seed completado!\n');
  console.log('📝 Datos de acceso para Postman:');
  console.log('   Email: test@gestionrural.com');
  console.log('   Password: password123');
  console.log('   Organization ID:', org.id);
  console.log('   Farm ID: 00000000-0000-0000-0000-000000000002\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
