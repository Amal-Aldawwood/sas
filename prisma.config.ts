import { defineConfig } from 'prisma';

export default defineConfig({
  // Database connection for migrations and Prisma Studio
  migrations: {
    // Database URL from environment variables
    adapter: { url: process.env.DATABASE_URL },
  },
  // Client configuration
  client: {
    // Database URL from environment variables
    adapter: { url: process.env.DATABASE_URL },
  },
});
