import { NextResponse } from 'next/server'
import { getDb } from '../../../lib/mongodb'

interface CostItem {
  id: string
  category: string
  label: string
  cost: number
}

interface Empanada {
  name: string
  costs: CostItem[]
  margin: number
}

export async function GET() {
  const db = await getDb()
  const list = await db.collection<Empanada>('empanadas').find().toArray()
  return NextResponse.json(list)
}

export async function POST(request: Request) {
  const empanada = await request.json() as Empanada
  const db = await getDb()
  await db.collection<Empanada>('empanadas').updateOne(
    { name: empanada.name },
    { $set: empanada },
    { upsert: true }
  )
  return NextResponse.json({ ok: true })
}
