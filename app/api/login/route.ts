import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongoose'
import User from '../../../models/User'
import { sign } from '../../../lib/jwt'

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
    const secret = process.env.JWT_SECRET || 'secret'
    const token = sign({ username }, secret)
    const res = NextResponse.json({ ok: true })
    res.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
    })
    return res
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}
