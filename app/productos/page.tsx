"use client"
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type Category =
  | 'Relleno'
  | 'Masa'
  | 'Horneado'
  | 'Envasado y Etiquetado'
  | 'Mano de obra'

type UnitType = 'kilo' | 'envase' | 'unidad' | 'metro'

interface Product {
  name: string
  unitType: UnitType
  price: number
  vat: number
  category?: Category
}

const categories: Category[] = [
  'Relleno',
  'Masa',
  'Horneado',
  'Envasado y Etiquetado',
  'Mano de obra',
]

const emptyForm: Product = {
  name: '',
  unitType: 'kilo',
  price: 0,
  vat: 21,
  category: 'Relleno',
}

export default function ProductosPage() {
  const [list, setList] = useState<Product[]>([])
  const [form, setForm] = useState<Product>(emptyForm)

  const fetchList = async () => {
    const list = await fetch('/api/productos').then(res => res.json())
    setList(list)
  }

  useEffect(() => {
    fetchList().catch(() => {})
  }, [])

  const saveProduct = async () => {
    if (!form.name) return
    try {
      await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      await fetchList()
      setForm(emptyForm)
      toast.success('Producto guardado', {
        style: { background: '#16a34a', color: '#fff' },
      })
    } catch {
      toast.error('Error al guardar', { style: { background: '#dc2626', color: '#fff' } })
    }
  }

  const deleteProduct = async (name: string) => {
    if (!confirm('¿Eliminar producto?')) return
    try {
      await fetch('/api/productos?name=' + encodeURIComponent(name), { method: 'DELETE' })
      await fetchList()
      toast.success('Producto eliminado', { style: { background: '#16a34a', color: '#fff' } })
    } catch {
      toast.error('Error al eliminar', { style: { background: '#dc2626', color: '#fff' } })
    }
  }

  return (
    <div className="p-6 mt-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-4">Productos</h1>
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border rounded px-2 py-1"
        />
        <select
          value={form.unitType}
          onChange={e => setForm({ ...form, unitType: e.target.value as Product['unitType'] })}
          className="border rounded px-2 py-1"
        >
          <option value="kilo">kilo</option>
          <option value="envase">envase</option>
          <option value="unidad">unidad</option>
          <option value="metro">metro</option>
        </select>
        <select
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value as Category })}
          className="border rounded px-2 py-1"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          step="0.0001"
          placeholder="Precio"
          value={form.price}
          onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
          className="border rounded px-2 py-1"
        />
        <input
          type="number"
          step="0.01"
          placeholder="IVA"
          value={form.vat}
          onChange={e => setForm({ ...form, vat: parseFloat(e.target.value) })}
          className="border rounded px-2 py-1"
        />
        <button onClick={saveProduct} className="bg-green-600 text-white py-2 rounded">
          Guardar
        </button>
      </div>
      {categories.map(cat => {
        const items = list.filter(p => p.category === cat)
        if (items.length === 0) return null
        return (
          <div key={cat} className="mb-4">
            <h2 className="font-semibold mb-2">{cat}</h2>
            <ul className="divide-y">
              {items.map(prod => (
                <li key={prod.name} className="py-2 flex justify-between items-center">
                  <span>
                    {prod.name} - {prod.price}€/ {prod.unitType} - IVA {prod.vat}%
                  </span>
                  <span>
                    <button className="text-blue-600 mr-2 hover:underline" onClick={() => setForm(prod)}>
                      Editar
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => deleteProduct(prod.name)}>
                      Eliminar
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      {list.filter(p => !p.category || !categories.includes(p.category)).length === 0 && list.length === 0 && (
        <p>No hay productos guardados</p>
      )}
      {list.filter(p => !p.category || !categories.includes(p.category)).length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Sin categoría</h2>
          <ul className="divide-y">
            {list
              .filter(p => !p.category || !categories.includes(p.category))
              .map(prod => (
                <li key={prod.name} className="py-2 flex justify-between items-center">
                  <span>
                    {prod.name} - {prod.price}€/ {prod.unitType} - IVA {prod.vat}%
                  </span>
                  <span>
                    <button className="text-blue-600 mr-2 hover:underline" onClick={() => setForm(prod)}>
                      Editar
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => deleteProduct(prod.name)}>
                      Eliminar
                    </button>
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
