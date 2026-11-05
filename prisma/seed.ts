import 'dotenv/config';
import { prisma } from '../src/db/client.js';

try {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !passwordHash) {
    console.info('No administrator seeded. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH to enable admin login.');
  } else if (!/^\$2[aby]\$\d{2}\$/.test(passwordHash)) {
    throw new Error('ADMIN_PASSWORD_HASH must be a bcrypt hash.');
  } else {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: 'Store administrator',
        email,
        passwordHash,
        role: 'super_admin'
      }
    });
    console.info('Ensured the configured administrator account exists.');
  }
} catch (error) {
  console.error('Database seed failed:', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
