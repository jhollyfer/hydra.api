// import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma';
import { Env } from '../start/env';

let prisma = new PrismaClient();

if (Env.NODE_ENV === 'production') {
  //   const neon = new Pool({ connectionString: Env.DATABASE_URL });
  console.log('PRODUCTION');
  const adapter = new PrismaNeon({
    connectionString: Env.DATABASE_URL,
  });

  prisma = new PrismaClient({
    adapter,
  });
}

export { prisma };
