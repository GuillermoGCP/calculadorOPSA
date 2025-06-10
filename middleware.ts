import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const expected = process.env.STATIC_TOKEN || ''
  if (!token || token !== expected) {
    const url = new URL('/', request.url)
    url.searchParams.set('unauthorized', '1')
    const res = NextResponse.redirect(url)
    res.cookies.delete('token')
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/calculadora/:path*', '/empanadas/:path*'],
}
