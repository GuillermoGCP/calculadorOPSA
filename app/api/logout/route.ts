import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  })
  return res
}
