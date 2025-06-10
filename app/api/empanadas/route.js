import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const dataFile = path.join(process.cwd(), 'data', 'empanadas.json')

async function readData() {
  try {
    const fileContents = await fs.promises.readFile(dataFile, 'utf8')
    return JSON.parse(fileContents)
  } catch {
    return []
  }
}

async function writeData(data) {
  await fs.promises.mkdir(path.dirname(dataFile), { recursive: true })
  await fs.promises.writeFile(dataFile, JSON.stringify(data, null, 2))
}

export async function GET() {
  const data = await readData()
  return NextResponse.json(data)
}

export async function POST(request) {
  const data = await readData()
  const empanada = await request.json()
  const index = data.findIndex(e => e.name === empanada.name)
  if (index !== -1) {
    data[index] = empanada
  } else {
    data.push(empanada)
  }
  await writeData(data)
  return NextResponse.json({ ok: true })
}
