import fs from 'fs'
import path from 'path'

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

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = readData()
    res.status(200).json(data)
  } else if (req.method === 'POST') {
    const data = readData()
    const empanada = req.body
    const index = data.findIndex(e => e.name === empanada.name)
    if (index !== -1) {
      data[index] = empanada
    } else {
      data.push(empanada)
    }
    writeData(data)
    res.status(200).json({ ok: true })
  } else {
    res.status(405).end()
  }
}
