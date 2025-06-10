import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongoose'
import Empanada from '../../../models/Empanada'

interface CostItem {
  id: string
  category: string
  label: string
  cost: number
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
