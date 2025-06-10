import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

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

const dataFile = path.join(process.cwd(), 'data', 'empanadas.json')

async function readData(): Promise<Empanada[]> {
  try {
    const fileContents = await fs.promises.readFile(dataFile, 'utf8')
    return JSON.parse(fileContents)
  } catch {
    return []
  }
}

async function writeData(data: Empanada[]): Promise<void> {
  await fs.promises.mkdir(path.dirname(dataFile), { recursive: true })
  await fs.promises.writeFile(dataFile, JSON.stringify(data, null, 2))
}

export async function GET(): Promise<NextResponse<Empanada[]>> {
  const data = await readData()
  return NextResponse.json(data)
}

export async function POST(request: Request): Promise<NextResponse<{ ok: boolean }>> {
  const data = await readData()
  const empanada = await request.json() as Empanada
  const index = data.findIndex(e => e.name === empanada.name)
  if (index !== -1) {
    data[index] = empanada
  } else {
    data.push(empanada)
  }
  await writeData(data)
  return NextResponse.json({ ok: true })
}
