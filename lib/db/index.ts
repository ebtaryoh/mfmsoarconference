import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.ts'

const connectionString = process.env.DATABASE_URL || ''

// For Supabase connection pooler (port 6543), prepared statements must be disabled
const client = postgres(connectionString, { 
  prepare: false, 
  ssl: 'require',
  max: 10 
})

export const db = drizzle(client, { schema })
export * from './schema.ts'
