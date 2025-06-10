import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/opsadb'
let cachedDb: Db | null = null

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb
  const client = await new MongoClient(uri).connect()
  cachedDb = client.db()
  return cachedDb
}
