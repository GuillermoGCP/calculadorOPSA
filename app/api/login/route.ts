import { NextResponse } from 'next/server'
import { getDb } from '../../../lib/mongodb'

interface User {
  username: string
  password: string
}

export async function POST(request: Request) {
  const { username, password } = await request.json() as User
  const db = await getDb()
  const users = db.collection<User>('users')
  await users.updateOne(
    { username: 'Miguel' },
    { $setOnInsert: { username: 'Miguel', password: 'jefeOPSA' } },
    { upsert: true }
  )
  const user = await users.findOne({ username, password })
  if (user) {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}
