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
  const existing = await User.findOne({ username })
  if (existing) {
    return NextResponse.json({ ok: false, error: 'Usuario ya existe' }, { status: 400 })
  }
  try {
    await User.create({ username, password })
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
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Error al registrar' }, { status: 500 })
  }
}
