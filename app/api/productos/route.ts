import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongoose'
import Product from '../../../models/Product'

interface ProductPayload {
  name: string
  unitType: 'kilo' | 'envase' | 'unidad'
  price: number
  vat: number
  category?: string
}

export async function GET() {
  await connectDB()
  const list = await Product.find().lean()
  return NextResponse.json(list)
}

export async function POST(request: Request) {
  const product = (await request.json()) as ProductPayload
  await connectDB()
  await Product.updateOne({ name: product.name }, { $set: product }, { upsert: true })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  await connectDB()
  const { searchParams } = new URL(request.url)
  let name = searchParams.get('name')
  if (!name) {
    try {
      const body = await request.json()
      name = body?.name
    } catch {
      // ignore
    }
  }
  if (!name) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 })
  }
  await Product.deleteOne({ name })
  return NextResponse.json({ ok: true })
}
