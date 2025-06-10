import crypto from 'crypto'

function base64url(buffer: Buffer): string {
  return buffer.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64urlDecode(str: string): Buffer {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = base64 + (pad === 2 ? '==' : pad === 3 ? '=' : pad === 1 ? '===' : '');
  return Buffer.from(padded, 'base64');
}

export function sign(payload: object, secret: string): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const headerEncoded = base64url(Buffer.from(JSON.stringify(header)))
  const payloadEncoded = base64url(Buffer.from(JSON.stringify(payload)))
  const data = `${headerEncoded}.${payloadEncoded}`
  const signature = crypto.createHmac('sha256', secret).update(data).digest()
  const signatureEncoded = base64url(signature)
  return `${data}.${signatureEncoded}`
}

export function verify(token: string, secret: string): any {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token')
  const [headerEncoded, payloadEncoded, signature] = parts
  const data = `${headerEncoded}.${payloadEncoded}`
  const expected = base64url(crypto.createHmac('sha256', secret).update(data).digest())
  if (signature !== expected) throw new Error('Invalid signature')
  const payloadJson = base64urlDecode(payloadEncoded).toString()
  return JSON.parse(payloadJson)
}
