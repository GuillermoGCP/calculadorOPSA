'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getStoredCategories } from '../lib/categories'

export type Category = string

export type UnitType = 'kilo' | 'envase' | 'unidad' | 'metro' | 'litro'

export interface Product {
  name: string
  unitType: UnitType
  price: number
  vat: number
  category?: Category
}

interface Props {
  product: Product
  onClose: () => void
  onSaved: (updated: Product) => void
  categories?: string[]
}

export default function ProductEditModal({ product, onClose, onSaved, categories: propCategories }: Props) {
  const [form, setForm] = useState<Product>(product)
  const [categories, setCategories] = useState<string[]>(propCategories || [])

  useEffect(() => {
    if (!propCategories) {
      setCategories(getStoredCategories())
    }
  }, [propCategories])

  const saveProduct = async () => {
    if (!form.name) return
    try {
      await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      toast.success('Producto guardado', {
        style: { background: '#16a34a', color: '#fff' },
      })
      onSaved(form)
    } catch {
      toast.error('Error al guardar', {
        style: { background: '#dc2626', color: '#fff' },
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-2">Editar producto</h2>
        <div className="flex flex-col gap-2 mb-2">
          <label className="flex flex-col">
            Nombre
            <input
              type="text"
              placeholder="Nombre"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="border rounded px-2 py-1"
            />
          </label>
          <label className="flex flex-col">
            Tipo de unidad
            <select
              value={form.unitType}
              onChange={e =>
                setForm({ ...form, unitType: e.target.value as Product['unitType'] })
              }
              className="border rounded px-2 py-1"
            >
              <option value="kilo">kilo</option>
              <option value="envase">envase</option>
              <option value="unidad">unidad</option>
              <option value="metro">metro</option>
              <option value="litro">litro</option>
            </select>
          </label>
          <label className="flex flex-col">
            Categoría
            <select
              value={form.category}
              onChange={e =>
                setForm({ ...form, category: e.target.value as Category })
              }
              className="border rounded px-2 py-1"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            Precio (€/unidad)
            <input
              type="number"
              step="0.0001"
              placeholder="Precio"
              value={form.price}
              onChange={e =>
                setForm({ ...form, price: parseFloat(e.target.value) })
              }
              className="border rounded px-2 py-1"
            />
          </label>
          <label className="flex flex-col">
            IVA (%)
            <input
              type="number"
              step="0.01"
              placeholder="IVA"
              value={form.vat}
              onChange={e =>
                setForm({ ...form, vat: parseFloat(e.target.value) })
              }
              className="border rounded px-2 py-1"
            />
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-300">Cancelar</button>
          <button onClick={saveProduct} className="bg-green-600 text-white px-3 py-1 rounded">Guardar</button>
        </div>
      </div>
    </div>
  )
}
