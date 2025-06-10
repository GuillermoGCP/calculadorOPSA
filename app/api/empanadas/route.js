import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const dataFile = path.join(process.cwd(), 'data', 'empanadas.json')

function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
  } catch {
    return []
  }
}

function writeData(data) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true })
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
}

export async function GET() {
  const data = readData()
  return NextResponse.json(data)
}

export async function POST(request) {
  const data = readData()
  const empanada = await request.json()
  const index = data.findIndex(e => e.name === empanada.name)
  if (index !== -1) {
    data[index] = empanada
  } else {
    data.push(empanada)
  }
  writeData(data)
  return NextResponse.json({ ok: true })
}
