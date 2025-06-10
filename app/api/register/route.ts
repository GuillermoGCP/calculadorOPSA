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
  const existing = await User.findOne({ username })
  if (existing) {
    return NextResponse.json({ ok: false, error: 'Usuario ya existe' }, { status: 400 })
  }
  try {
    await User.create({ username, password })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Error al registrar' }, { status: 500 })
  }
}
