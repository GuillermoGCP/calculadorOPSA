import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const expected = process.env.STATIC_TOKEN || ''
  if (!token || token !== expected) {
    const res = NextResponse.redirect(new URL('/', request.url))
    res.cookies.delete('token')
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/calculadora/:path*', '/empanadas/:path*'],
}
