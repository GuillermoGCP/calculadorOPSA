"use client"
import { useEffect, useState } from 'react'
import { createWorkbookFromObjects, downloadWorkbook } from '../../lib/exportExcel'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import {
  DEFAULT_CATEGORIES,
  getStoredCategories,
  saveCategories,
} from '../../lib/categories'

type Category = string

type UnitType = 'kilo' | 'envase' | 'unidad' | 'metro' | 'litro'

interface Product {
  name: string
  unitType: UnitType
  price: number
  vat: number
  category?: Category
}


const emptyForm: Product = {
  name: '',
  unitType: 'kilo',
  price: 0,
  vat: 21,
  category: DEFAULT_CATEGORIES[0],
}

export default function ProductosPage() {
  const [list, setList] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(getStoredCategories())
  const [newCategory, setNewCategory] = useState<string>('')
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState<Product>(emptyForm)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const returnParam = searchParams.get('return')
  const returnUrl = returnParam || '/calculadora'

  const fetchList = async () => {
    const list = await fetch('/api/productos').then(res => res.json())
    setList(list)
  }

  useEffect(() => {
    setOpen(prev => {
      const obj = { ...prev }
      categories.forEach(cat => {
        if (!(cat in obj)) obj[cat] = true
      })
      if (!('sin' in obj)) obj.sin = true
      return obj
    })
  }, [categories])

  useEffect(() => {
    fetchList().catch(() => {})
  }, [])

  useEffect(() => {
    const nameParam = searchParams.get('edit')
    if (nameParam) {
      setEditingProduct(nameParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (editingProduct && list.length) {
      const prod = list.find(p => p.name === editingProduct)
      if (prod) {
        setForm(prod)
      }
    }
  }, [editingProduct, list])

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
      setEditingProduct(null)
      toast.success('Producto guardado', {
        style: { background: '#16a34a', color: '#fff' },
      })
      if (editingProduct && returnParam) {
        router.push(returnParam)
      }
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
      <button
        onClick={() => {
          if (list.length === 0) return
          const rows = list.map(p => ({
            Nombre: p.name,
            Unidad: p.unitType,
            Precio: p.price,
            IVA: p.vat,
            Categoria: p.category || '',
          }))
          const wb = createWorkbookFromObjects(rows, 'Productos')
          downloadWorkbook(wb, 'productos.xlsx')
        }}
        className="mb-4 bg-blue-700 text-white px-2 py-1 rounded"
      >
        Exportar lista
      </button>
      {returnUrl && (
        <button
          onClick={() => router.push(returnUrl)}
          className="mb-4 bg-blue-600 text-white px-2 py-1 rounded"
        >
          Regresar
        </button>
      )}
      <h2 className="text-lg font-semibold mb-2">Nueva categoría</h2>
      <div className="flex gap-2 items-end mb-4">
        <label className="flex flex-col flex-grow">
          Nombre
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
        <button
          onClick={() => {
            if (!newCategory) return
            if (categories.includes(newCategory)) {
              toast.error('La categoría ya existe', {
                style: { background: '#dc2626', color: '#fff' },
              })
              return
            }
            const cats = [...categories, newCategory]
            setCategories(cats)
            saveCategories(cats)
            setNewCategory('')
          }}
          className="bg-blue-600 text-white px-2 py-1 rounded"
        >
          Añadir
        </button>
      </div>
      <h2 className="text-lg font-semibold mb-2">
        {editingProduct ? 'Editar producto' : 'Nuevo producto'}
      </h2>
      <div className="flex flex-col gap-2 mb-4">
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
        <div className="flex gap-2">
          {editingProduct && (
            <button
              onClick={() => {
                setEditingProduct(null)
                setForm(emptyForm)
              }}
              className="bg-gray-300 text-black py-2 rounded flex-1"
            >
              Cancelar
            </button>
          )}
          <button onClick={saveProduct} className="bg-green-600 text-white py-2 rounded flex-1">
            Guardar
          </button>
        </div>
      </div>
      {!editingProduct && (
        <>
          {categories.map(cat => {
            const items = list.filter(p => p.category === cat)
            if (items.length === 0) return null
            const isOpen = open[cat]
            return (
              <div key={cat} className="mb-2 border rounded">
                <button
                  className="w-full text-left px-2 py-2 bg-gray-100 font-semibold"
                  onClick={() => setOpen(o => ({ ...o, [cat]: !isOpen }))}
                >
                  {cat}
                </button>
                {isOpen && (
                  <ul className="divide-y px-2 py-2">
                    {items.map(prod => (
                      <li key={prod.name} className="py-2 flex justify-between items-center">
                        <span>
                          {prod.name} - {prod.price}€/ {prod.unitType} - IVA {prod.vat}%
                        </span>
                        <span>
                          <button
                            className="text-blue-600 mr-2 hover:underline"
                            onClick={() => {
                              setForm(prod)
                              setEditingProduct(prod.name)
                            }}
                          >
                            Editar
                          </button>
                          <button className="text-red-600 hover:underline" onClick={() => deleteProduct(prod.name)}>
                            Eliminar
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
          {list.filter(p => !p.category || !categories.includes(p.category)).length === 0 && list.length === 0 && (
            <p>No hay productos guardados</p>
          )}
          {list.filter(p => !p.category || !categories.includes(p.category)).length > 0 && (
            <div className="mb-2 border rounded">
              <button
                className="w-full text-left px-2 py-2 bg-gray-100 font-semibold"
                onClick={() => setOpen(o => ({ ...o, sin: !o.sin }))}
              >
                Sin categoría
              </button>
              {open.sin && (
                <ul className="divide-y px-2 py-2">
                  {list
                    .filter(p => !p.category || !categories.includes(p.category))
                    .map(prod => (
                      <li key={prod.name} className="py-2 flex justify-between items-center">
                        <span>
                          {prod.name} - {prod.price}€/ {prod.unitType} - IVA {prod.vat}%
                        </span>
                        <span>
                          <button
                            className="text-blue-600 mr-2 hover:underline"
                            onClick={() => {
                              setForm(prod)
                              setEditingProduct(prod.name)
                            }}
                          >
                            Editar
                          </button>
                          <button className="text-red-600 hover:underline" onClick={() => deleteProduct(prod.name)}>
                            Eliminar
                          </button>
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
