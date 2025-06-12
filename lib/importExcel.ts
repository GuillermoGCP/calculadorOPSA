import * as XLSX from 'xlsx'

export interface ImportedCost {
  category: string
  label: string
  price: number
  quantity: number
  unitType: string
  vat: number
}

export interface ImportedEmpanada {
  name: string
  costs: ImportedCost[]
  margin: number
}

export async function readEmpanadaFile(file: File): Promise<ImportedEmpanada> {
  const data = await file.arrayBuffer()
  const wb = XLSX.read(data)
  const sheetName = wb.SheetNames[0]
  const ws = wb.Sheets[sheetName]
  const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws)
  const costs: ImportedCost[] = []
  let margin = 0

  rows.forEach(row => {
    if (row['Concepto'] === 'Margen (%)') {
      margin = parseFloat(row['Coste']) || 0
    } else if (row['Categoria']) {
      costs.push({
        category: row['Categoria'],
        label: row['Concepto'],
        quantity: parseFloat(row['Cantidad'] ?? '0'),
        unitType: row['Medida'],
        price: parseFloat(row['Precio'] ?? '0'),
        vat: parseFloat(row['IVA'] ?? '0'),
      })
    }
  })

  return { name: sheetName, costs, margin }
}

