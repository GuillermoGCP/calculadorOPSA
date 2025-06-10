import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongoose'
import User from '../../../models/User'

interface Credentials {
  username: string
  password: string
}

export async function POST(request: Request) {
  const { username, password } = await request.json() as Credentials
  await connectDB()
  await User.updateOne(
    { username: 'Miguel' },
    { $setOnInsert: { username: 'Miguel', password: 'jefeOPSA' } },
    { upsert: true }
  )
  const user = await User.findOne({ username, password })
  if (user) {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}
