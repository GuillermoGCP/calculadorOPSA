"use client"
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

interface CostItem {
  id: string
  category: string
  label: string
  cost: number
  isEditing?: boolean
}

interface Empanada {
  name: string
  costs: CostItem[]
  margin: number
}

const initialCosts = [
  { id: 'carne', category: 'Relleno', label: 'Carne', cost: 1.95 },
  { id: 'cebolla', category: 'Relleno', label: 'Cebolla', cost: 0.8 },
  { id: 'azafran', category: 'Relleno', label: 'Azafrán', cost: 0.025 },
  { id: 'sal_relleno', category: 'Relleno', label: 'Sal', cost: 0.0048 },
  { id: 'azucar', category: 'Relleno', label: 'Azúcar', cost: 0.012 },
  { id: 'aceite_relleno', category: 'Relleno', label: 'Aceite', cost: 0.08 },
  { id: 'gas_cocina', category: 'Relleno', label: 'Gas cocina', cost: 0.026 },

  { id: 'harina', category: 'Masa', label: 'Harina', cost: 0.112 },
  { id: 'aceite_masa', category: 'Masa', label: 'Aceite', cost: 0.088 },
  { id: 'margarina', category: 'Masa', label: 'Margarina vegetal', cost: 0.031 },
  { id: 'sal_masa', category: 'Masa', label: 'Sal', cost: 0.0008 },
  { id: 'levadura', category: 'Masa', label: 'Levadura', cost: 0.0088 },
  { id: 'electricidad_amasadora', category: 'Masa', label: 'Electricidad amasadora', cost: 0.0358 },

  { id: 'bano_huevo', category: 'Horneado', label: 'Baño de huevo', cost: 0.076 },
  { id: 'gas_horno', category: 'Horneado', label: 'Gas horno', cost: 0.231 },

  { id: 'papel_kraft', category: 'Envasado y Etiquetado', label: 'Papel kraft base', cost: 0.11 },
  { id: 'bandeja_carton', category: 'Envasado y Etiquetado', label: 'Bandeja cartón', cost: 0.09 },
  { id: 'sobre_papel', category: 'Envasado y Etiquetado', label: 'Sobre papel', cost: 0.028 },
  { id: 'plastico_film', category: 'Envasado y Etiquetado', label: 'Plástico film', cost: 0.0025 },
  { id: 'etiqueta_caja', category: 'Envasado y Etiquetado', label: 'Etiqueta caja', cost: 0.034 },
  { id: 'folio_direccion', category: 'Envasado y Etiquetado', label: 'Folio etiqueta dirección', cost: 0.0043 },
  { id: 'toner', category: 'Envasado y Etiquetado', label: 'Tóner impresora', cost: 0.0234 },
  { id: 'cinta_adhesiva', category: 'Envasado y Etiquetado', label: 'Cinta adhesiva embalaje', cost: 0.001 },

  { id: 'mano_de_obra', category: 'Mano de obra', label: 'Mano de obra', cost: 0.72 }
]

export default function Home() {
  const [costs, setCosts] = useState<CostItem[]>(initialCosts.map(c => ({ ...c, isEditing: false })))
  const [margin, setMargin] = useState<number>(0)
  const [showTotals, setShowTotals] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [saved, setSaved] = useState<Empanada[]>([])
  const [selected, setSelected] = useState<string>('')
  const [newEntries, setNewEntries] = useState<Record<string, { label: string; cost: number }>>({})

  const deleteItem = (id: string) => {
    if (confirm('¿Eliminar concepto?')) {
      setCosts(costs.filter(item => item.id !== id))
    }
  }

  const searchParams = useSearchParams()

  useEffect(() => {
    fetch('/api/empanadas')
      .then(res => res.json())
      .then(list => {
        setSaved(list)
        const nameParam = searchParams.get('emp')
        if (nameParam) {
          const emp = list.find(e => e.name === nameParam)
          if (emp) {
            loadEmpanada(emp)
            setName(emp.name)
          }
        }
      })
      .catch(() => {})
  }, [])

  const handleCostChange = (id: string, value: number) => {
    setCosts(costs.map(item => item.id === id ? { ...item, cost: value } : item))
  }

  const handleLabelChange = (id: string, value: string) => {
    setCosts(costs.map(item => item.id === id ? { ...item, label: value } : item))
  }

  const toggleEdit = (id: string) => {
    setCosts(costs.map(item => item.id === id ? { ...item, isEditing: !item.isEditing } : item))
  }

  const handleNewEntryChange = (category: string, field: 'label' | 'cost', value: string | number) => {
    setNewEntries(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }))
  }

  const addItem = (category: string) => {
    const entry = newEntries[category]
    if (!entry?.label) return
    const newItem: CostItem = {
      id: `${category.toLowerCase()}_${Date.now()}`,
      category,
      label: entry.label,
      cost: Number(entry.cost) || 0,
      isEditing: false
    }
    setCosts([...costs, newItem])
    setNewEntries(prev => ({ ...prev, [category]: { label: '', cost: 0 } }))
  }

  const saveEmpanada = async () => {
    if (!name) return
    const exists = saved.some(e => e.name === name)
    if (exists && !confirm('Ya existe una empanada con ese nombre. ¿Desea sobrescribirla?')) {
      return
    }
    const payload: Empanada = { name, costs: costs.map(({ isEditing, ...rest }) => rest), margin }
    try {
      await fetch('/api/empanadas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const list = await fetch('/api/empanadas').then(res => res.json())
      setSaved(list)
      toast.success('Empanada guardada', { style: { background: '#16a34a', color: '#fff' } })
    } catch {
      toast.error('Error al guardar', { style: { background: '#dc2626', color: '#fff' } })
    }
  }

  const loadEmpanada = (emp: Empanada) => {
    setCosts(emp.costs.map(c => ({ ...c, isEditing: false })))
    setMargin(emp.margin)
    setShowTotals(false)
    toast.success('Empanada cargada', { style: { background: '#16a34a', color: '#fff' } })
  }

  const total = costs.reduce((sum, item) => sum + (item.cost || 0), 0)
  const vat = total * 0.10
  const totalWithVat = total + vat
  const sellingPrice = totalWithVat * (1 + (margin || 0) / 100)
  const profit = sellingPrice - totalWithVat

  const categories = Array.from(new Set(costs.map(c => c.category)))

  return (

    <div className="p-6 mt-6 font-sans max-w-screen-lg mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Calculadora de Costes de Empanadas</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre de empanada"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button onClick={saveEmpanada} className="ml-2 bg-green-600 text-white px-3 py-1 rounded">Guardar empanada</button>
      </div>

      <div className="mb-4">
        <select value={selected} onChange={e => setSelected(e.target.value)} className="border rounded px-2 py-1">
          <option value="">Cargar empanada...</option>
          {saved.map(emp => (
            <option key={emp.name} value={emp.name}>{emp.name}</option>
          ))}
        </select>
        <button
          onClick={() => {
            const emp = saved.find(e => e.name === selected)
            if (emp) loadEmpanada(emp)
          }}
          className="ml-2 bg-green-600 text-white px-3 py-1 rounded"
        >
          Cargar
        </button>
      </div>


      {categories.map(cat => (
        <div key={cat} className="mb-4">
          <h2 className="text-xl font-semibold mb-2">{cat}</h2>
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-1">Concepto</th>
                <th className="pb-1">Costo (€)</th>
              </tr>
            </thead>
            <tbody>
              {costs.filter(c => c.category === cat).map(item => (

                <tr key={item.id}>
                  <td>
                    {item.isEditing ? (
                      <input
                        type="text"
                        value={item.label}
                        onChange={e => handleLabelChange(item.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      item.label
                    )}
                  </td>
                  <td>
                    {item.isEditing ? (
                      <>
                        <input
                          type="number"
                          value={item.cost}
                          step="0.0001"
                          onChange={e => handleCostChange(item.id, parseFloat(e.target.value))}
                          className="border rounded px-2 py-1 w-24"
                        />
                        <button onClick={() => toggleEdit(item.id)} className="ml-2 bg-blue-600 text-white px-2 py-1 rounded">Guardar</button>
                      </>
                    ) : (
                      <>
                        {item.cost.toFixed(4)}
                        <button onClick={() => toggleEdit(item.id)} className="ml-2 bg-blue-600 text-white px-2 py-1 rounded">Editar</button>
                        <button onClick={() => deleteItem(item.id)} className="ml-2 bg-red-600 text-white px-2 py-1 rounded">Borrar</button>
                      </>
                    )}

                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="Nuevo concepto"
                    value={newEntries[cat]?.label || ''}
                    onChange={e => handleNewEntryChange(cat, 'label', e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Costo"
                    value={newEntries[cat]?.cost || 0}
                    onChange={e => handleNewEntryChange(cat, 'cost', parseFloat(e.target.value))}
                    className="border rounded px-2 py-1 w-24"
                  />
                  <button onClick={() => addItem(cat)} className="ml-2 bg-green-600 text-white px-2 py-1 rounded">Añadir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <div className="mt-4">
        <label>
          Margen de beneficio (%):

          <input
            className="border rounded px-2 py-1 w-24"
            type="number"
            value={margin}
            step="0.01"
            onChange={e => setMargin(parseFloat(e.target.value))}
          />
        </label>
      </div>


      <button onClick={() => setShowTotals(true)} className="mt-4 bg-green-700 text-white px-4 py-2 rounded">
        Obtener gastos y beneficios
      </button>

      {showTotals && (
        <div className="mt-4">
          <p>Total: {total.toFixed(4)} €</p>
          <p>IVA (10%): {vat.toFixed(4)} €</p>
          <p>Total con IVA: {totalWithVat.toFixed(4)} €</p>
          <p>Precio de venta: {sellingPrice.toFixed(4)} €</p>
          <p>Beneficio: {profit.toFixed(4)} €</p>
        </div>
      )}

    </div>
  )
}
