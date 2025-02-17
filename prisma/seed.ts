import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { seedObservabilityTemplate } from './seeds/observability';
import { seedDoraTemplate } from './seeds/dora';
import { seedSecurityTemplate } from './seeds/security';
import { seedCloudNativeTemplate } from './seeds/cloud-native';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
    },
  });

  // Create Acme organisation
  const acme = await prisma.organisation.create({
    data: {
      name: 'Acme',
      users: {
        create: {
          userId: adminUser.id,
          role: 'admin',
        },
      },
    },
  });

  // Create Northwind organisation
  const northwind = await prisma.organisation.create({
    data: {
      name: 'Northwind',
      users: {
        create: {
          userId: adminUser.id,
          role: 'admin',
        },
      },
    },
  });

  // Create Acme teams
  const acmeEngineering = await prisma.team.create({
    data: {
      name: 'Engineering',
      organisationId: acme.id,
    },
  });

  const acmeAI = await prisma.team.create({
    data: {
      name: 'AI',
      organisationId: acme.id,
    },
  });

  // Create Northwind teams
  const northwindSales = await prisma.team.create({
    data: {
      name: 'Sales',
      organisationId: northwind.id,
    },
  });

  const northwindMarketing = await prisma.team.create({
    data: {
      name: 'Marketing',
      organisationId: northwind.id,
    },
  });

  // Create services for each team
  const services = [
    { name: 'web', teamId: acmeEngineering.id },
    { name: 'data-processor', teamId: acmeEngineering.id },
    { name: 'mongodb', teamId: acmeAI.id },
    { name: 'clickhouse', teamId: acmeAI.id },
    { name: 'pgsql', teamId: northwindSales.id },
    { name: 'typesense', teamId: northwindSales.id },
    { name: 'web', teamId: northwindMarketing.id },
    { name: 'mongodb', teamId: northwindMarketing.id },
  ];

  const createdServices = await Promise.all(
    services.map(service =>
      prisma.service.create({
        data: service,
      })
    )
  );

  // Seed templates
  await seedObservabilityTemplate();
  await seedDoraTemplate();
  await seedSecurityTemplate();
  await seedCloudNativeTemplate();

  console.log('Seed data created successfully');
  console.log('Admin user credentials:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
