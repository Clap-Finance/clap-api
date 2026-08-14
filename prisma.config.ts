import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:lyhweJEODGPfBNxdLNMinxdUIcTUabxo@postgres.railway.internal:5432/railway',
  },
})
