// import { Env } from '@start/env';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma';
import { Env } from '../start/env';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(Env.ADMIN_PASSWORD, 6);
  await prisma.user.upsert({
    where: { email: Env.ADMIN_EMAIL },
    update: {},
    create: {
      email: Env.ADMIN_EMAIL,
      name: 'Administrador',
      role: 'ADMINISTRATOR',
      password,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
