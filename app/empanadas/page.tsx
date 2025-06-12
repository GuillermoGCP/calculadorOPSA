'use client'
import { useEffect, useState } from 'react'
import { downloadWorkbook } from '../../lib/exportExcel'
import * as XLSX from 'xlsx'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

interface CostItem {
  id: string
  category: string
  label: string
  cost: number
  vat: number
}

interface Empanada {
  name: string
  costs: CostItem[]
  margin: number
}

const getTotal = (costs: CostItem[]) =>
  costs.reduce((sum, item) => sum + item.cost, 0)

const getVatTotal = (costs: CostItem[]) =>
  costs.reduce((sum, item) => sum + (item.cost * item.vat) / 100, 0)

const getTotalWithVat = (costs: CostItem[]) => {
  const total = getTotal(costs)
  const vatTotal = getVatTotal(costs)
  return total + vatTotal
}

const getProfit = (costs: CostItem[], margin: number) =>
  (getTotalWithVat(costs) * margin) / 100

export default function EmpanadasPage() {
  const [list, setList] = useState<Empanada[]>([])
  const router = useRouter()

  const fetchList = async () => {
    const list = await fetch('/api/empanadas').then((res) => res.json())
    setList(list)
  }

  useEffect(() => {
    fetchList().catch(() => {})
  }, [])

  const openEmpanada = (name: string) => {
    if (confirm('¿Abrir calculadora con esta empanada?')) {
      router.push(`/calculadora?emp=${encodeURIComponent(name)}`)
    }
  }

  const deleteEmpanada = async (name: string) => {
    if (!confirm('¿Eliminar empanada?')) return
    try {
      await fetch('/api/empanadas?name=' + encodeURIComponent(name), {
        method: 'DELETE',
      })
      await fetchList()
      toast.success('Empanada eliminada', {
        style: { background: '#16a34a', color: '#fff' },
      })
    } catch {
      toast.error('Error al eliminar', {
        style: { background: '#dc2626', color: '#fff' },
      })
    }
  }

  return (
    <div className='p-6 mt-6 max-w-md mx-auto bg-white rounded-lg shadow-lg'>
      <h1 className='text-xl font-bold mb-4'>Empanadas guardadas</h1>
      <button
        className='mb-4 bg-blue-700 text-white px-2 py-1 rounded'
        onClick={() => {
          if (list.length === 0) return
          const wb = XLSX.utils.book_new()
          list.forEach((emp) => {
            const rows = emp.costs.map((c) => ({
              Categoria: c.category,
              Concepto: c.label,
              Coste: c.cost,
              IVA: c.vat,
            }))
            const total = getTotal(emp.costs)
            const vatTotal = getVatTotal(emp.costs)
            const totalWithVat = total + vatTotal
            const profit = getProfit(emp.costs, emp.margin)
            rows.push({})
            rows.push({ Concepto: 'Total', Coste: total })
            rows.push({ Concepto: 'IVA total', Coste: vatTotal })
            rows.push({ Concepto: 'Total con IVA', Coste: totalWithVat })
            rows.push({ Concepto: 'Margen (%)', Coste: emp.margin })
            rows.push({ Concepto: 'Beneficio', Coste: profit })
            const ws = XLSX.utils.json_to_sheet(rows)
            XLSX.utils.book_append_sheet(wb, ws, emp.name)
          })
          downloadWorkbook(wb, 'empanadas.xlsx')
        }}
      >
        Exportar todas
      </button>
      <ul className='divide-y'>
        {list.map((emp) => {
          const totalWithVat = getTotalWithVat(emp.costs)
          const profit = getProfit(emp.costs, emp.margin)
          return (
            <li
              key={emp.name}
              className='py-2 flex justify-between items-center'
            >
              <span
                className='cursor-pointer text-blue-600 hover:underline'
                onClick={() => openEmpanada(emp.name)}
              >
                {emp.name} - Coste {totalWithVat.toFixed(2)} - Beneficio neto{' '}
                {profit.toFixed(2)}
              </span>
              <button
                className='text-red-600 ml-2 hover:underline'
                onClick={() => deleteEmpanada(emp.name)}
              >
                Eliminar
              </button>
            </li>
          )
        })}
        {list.length === 0 && <li>No hay empanadas guardadas</li>}
      </ul>
    </div>
  )
}
