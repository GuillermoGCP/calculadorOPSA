import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongoose'
import Empanada from '../../../models/Empanada'

import { UnitType } from '../../../models/Product'

interface CostItem {
  id: string
  category: string
  label: string
  price: number
  quantity: number
  unitType?: UnitType
  cost: number
  vat: number
}

interface EmpanadaPayload {
  name: string
  costs: CostItem[]
  margin: number
}

export async function GET() {
  await connectDB()
  const list = await Empanada.find().lean()
  return NextResponse.json(list)
}

export async function POST(request: Request) {
  const empanada = await request.json() as EmpanadaPayload
  await connectDB()
  await Empanada.updateOne(
    { name: empanada.name },
    { $set: empanada },
    { upsert: true }
  )
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
      // ignore json parse error
    }
  }

  if (!name) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 })
  }

  await Empanada.deleteOne({ name })
  return NextResponse.json({ ok: true })
}
