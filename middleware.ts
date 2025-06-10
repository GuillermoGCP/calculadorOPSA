import { NextRequest, NextResponse } from 'next/server'
import { verify } from './lib/jwt'

const secret = process.env.JWT_SECRET || 'secret'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  try {
    verify(token, secret)
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL('/', request.url))
    res.cookies.delete('token')
    return res
  }
}

export const config = {
  matcher: ['/calculadora/:path*', '/empanadas/:path*'],
}
