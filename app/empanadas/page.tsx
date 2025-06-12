"use client"
import { useEffect, useState } from 'react'
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
  costs.reduce((sum, item) => sum + item.cost * item.vat / 100, 0)

const getTotalWithVat = (costs: CostItem[]) => {
  const total = getTotal(costs)
  const vatTotal = getVatTotal(costs)
  return total + vatTotal
}

const getProfit = (costs: CostItem[], margin: number) =>
  getTotalWithVat(costs) * margin / 100

export default function EmpanadasPage() {
  const [list, setList] = useState<Empanada[]>([])
  const router = useRouter()

  const fetchList = async () => {
    const list = await fetch('/api/empanadas').then(res => res.json())
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
        method: 'DELETE'
      })
      await fetchList()
      toast.success('Empanada eliminada', { style: { background: '#16a34a', color: '#fff' } })
    } catch {
      toast.error('Error al eliminar', { style: { background: '#dc2626', color: '#fff' } })
    }
  }

  return (
    <div className="p-6 mt-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-4">Empanadas guardadas</h1>
      <ul className="divide-y">
        {list.map(emp => {
          const totalWithVat = getTotalWithVat(emp.costs)
          const profit = getProfit(emp.costs, emp.margin)
          return (
            <li key={emp.name} className="py-2 flex justify-between items-center">
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => openEmpanada(emp.name)}
              >
                {emp.name} - Coste {totalWithVat.toFixed(2)} - Beneficio neto {profit.toFixed(2)}
              </span>
              <button
                className="text-red-600 ml-2 hover:underline"
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
