import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'empanadas.json')

async function readData() {
  try {
    const content = await fs.promises.readFile(dataFile, 'utf8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

async function writeData(data) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true })
  await fs.promises.writeFile(dataFile, JSON.stringify(data, null, 2))
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = await readData()
    res.status(200).json(data)
  } else if (req.method === 'POST') {
    const data = await readData()
    const empanada = req.body
    const index = data.findIndex(e => e.name === empanada.name)
    if (index !== -1) {
      data[index] = empanada
    } else {
      data.push(empanada)
    }
    await writeData(data)
    res.status(200).json({ ok: true })
  } else {
    res.status(405).end()
  }
}
