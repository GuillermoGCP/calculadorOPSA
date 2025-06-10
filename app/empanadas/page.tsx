"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Empanada {
  name: string
}

export default function EmpanadasPage() {
  const [list, setList] = useState<Empanada[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/empanadas')
      .then(res => res.json())
      .then(setList)
      .catch(() => {})
  }, [])

  const openEmpanada = (name: string) => {
    if (confirm('¿Abrir calculadora con esta empanada?')) {
      router.push(`/calculadora?emp=${encodeURIComponent(name)}`)
    }
  }

  return (
    <div className="p-6 mt-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-4">Empanadas guardadas</h1>
      <ul className="divide-y">
        {list.map(emp => (
          <li
            key={emp.name}
            className="py-2 cursor-pointer text-blue-600 hover:underline"
            onClick={() => openEmpanada(emp.name)}
          >
            {emp.name}
          </li>
        ))}
        {list.length === 0 && <li>No hay empanadas guardadas</li>}
      </ul>
    </div>
  )
}
