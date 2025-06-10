"use client"
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

interface CostItem {
  id: string
  category: string
  label: string
  price: number
  quantity: number
  vat: number
  isEditing?: boolean
}

interface Empanada {
  name: string
  costs: CostItem[]
  margin: number
}

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

interface NewEntry {
  productName?: string
  name: string
  unitType: UnitType
  price: number
  vat: number
  quantity: number
}

const initialCosts = [
  { id: 'carne', category: 'Relleno', label: 'Carne', price: 1.95, quantity: 1, vat: 10 },
  { id: 'cebolla', category: 'Relleno', label: 'Cebolla', price: 0.8, quantity: 1, vat: 10 },
  { id: 'azafran', category: 'Relleno', label: 'Azafrán', price: 0.025, quantity: 1, vat: 10 },
  { id: 'sal_relleno', category: 'Relleno', label: 'Sal', price: 0.0048, quantity: 1, vat: 10 },
  { id: 'azucar', category: 'Relleno', label: 'Azúcar', price: 0.012, quantity: 1, vat: 10 },
  { id: 'aceite_relleno', category: 'Relleno', label: 'Aceite', price: 0.08, quantity: 1, vat: 10 },
  { id: 'gas_cocina', category: 'Relleno', label: 'Gas cocina', price: 0.026, quantity: 1, vat: 10 },

  { id: 'harina', category: 'Masa', label: 'Harina', price: 0.112, quantity: 1, vat: 10 },
  { id: 'aceite_masa', category: 'Masa', label: 'Aceite', price: 0.088, quantity: 1, vat: 10 },
  { id: 'margarina', category: 'Masa', label: 'Margarina vegetal', price: 0.031, quantity: 1, vat: 10 },
  { id: 'sal_masa', category: 'Masa', label: 'Sal', price: 0.0008, quantity: 1, vat: 10 },
  { id: 'levadura', category: 'Masa', label: 'Levadura', price: 0.0088, quantity: 1, vat: 10 },
  { id: 'electricidad_amasadora', category: 'Masa', label: 'Electricidad amasadora', price: 0.0358, quantity: 1, vat: 10 },

  { id: 'bano_huevo', category: 'Horneado', label: 'Baño de huevo', price: 0.076, quantity: 1, vat: 10 },
  { id: 'gas_horno', category: 'Horneado', label: 'Gas horno', price: 0.231, quantity: 1, vat: 10 },

  { id: 'papel_kraft', category: 'Envasado y Etiquetado', label: 'Papel kraft base', price: 0.11, quantity: 1, vat: 21 },
  { id: 'bandeja_carton', category: 'Envasado y Etiquetado', label: 'Bandeja cartón', price: 0.09, quantity: 1, vat: 21 },
  { id: 'sobre_papel', category: 'Envasado y Etiquetado', label: 'Sobre papel', price: 0.028, quantity: 1, vat: 21 },
  { id: 'plastico_film', category: 'Envasado y Etiquetado', label: 'Plástico film', price: 0.0025, quantity: 1, vat: 21 },
  { id: 'etiqueta_caja', category: 'Envasado y Etiquetado', label: 'Etiqueta caja', price: 0.034, quantity: 1, vat: 21 },
  { id: 'folio_direccion', category: 'Envasado y Etiquetado', label: 'Folio etiqueta dirección', price: 0.0043, quantity: 1, vat: 21 },
  { id: 'toner', category: 'Envasado y Etiquetado', label: 'Tóner impresora', price: 0.0234, quantity: 1, vat: 21 },
  { id: 'cinta_adhesiva', category: 'Envasado y Etiquetado', label: 'Cinta adhesiva embalaje', price: 0.001, quantity: 1, vat: 21 },

  { id: 'mano_de_obra', category: 'Mano de obra', label: 'Mano de obra', price: 0.72, quantity: 1, vat: 21 }
]

const defaultVatForCategory = (category: string) =>
  ['Relleno', 'Masa', 'Horneado'].includes(category) ? 10 : 21

export default function Home() {
  const [costs, setCosts] = useState<CostItem[]>(initialCosts.map(c => ({ ...c, isEditing: false })))
  const [margin, setMargin] = useState<number>(0)
  const [showTotals, setShowTotals] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [saved, setSaved] = useState<Empanada[]>([])
  const [selected, setSelected] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [newEntries, setNewEntries] = useState<Record<string, NewEntry>>({})

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

    fetch('/api/productos')
      .then(res => res.json())
      .then(list => setProducts(list))
      .catch(() => {})
  }, [])

  const handleQuantityChange = (id: string, value: number) => {
    setCosts(costs.map(item => item.id === id ? { ...item, quantity: value } : item))
  }

  const handleLabelChange = (id: string, value: string) => {
    setCosts(costs.map(item => item.id === id ? { ...item, label: value } : item))
  }

  const handleVatChange = (id: string, value: number) => {
    setCosts(costs.map(item => item.id === id ? { ...item, vat: value } : item))
  }

  const toggleEdit = (id: string) => {
    setCosts(costs.map(item => item.id === id ? { ...item, isEditing: !item.isEditing } : item))
  }

  const handleNewEntryChange = (
    category: string,
    field: keyof NewEntry,
    value: string | number
  ) => {
    setNewEntries(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }))
  }

  const handleProductSelect = (category: string, name: string) => {
    if (!name) {
      setNewEntries(prev => ({
        ...prev,
        [category]: {
          name: '',
          unitType: 'kilo',
          price: 0,
          vat: defaultVatForCategory(category),
          quantity: 0,
        },
      }))
      return
    }
    const prod = products.find(p => p.name === name)
    if (prod) {
      setNewEntries(prev => ({
        ...prev,
        [category]: {
          productName: prod.name,
          name: prod.name,
          unitType: prod.unitType,
          price: prod.price,
          vat: prod.vat,
          quantity: 1,
        },
      }))
    }
  }

  const addItem = (category: string) => {
    const entry = newEntries[category]
    if (!entry?.name) return
    const newItem: CostItem = {
      id: `${category.toLowerCase()}_${Date.now()}`,
      category,
      label: entry.name,
      price: entry.price,
      quantity: entry.quantity,
      vat: entry.vat ?? defaultVatForCategory(category),
      isEditing: false,
    }
    if (!entry.productName) {
      fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: entry.name,
          unitType: entry.unitType,
          price: entry.price,
          vat: entry.vat,
          category,
        })
      })
        .then(() => fetch('/api/productos').then(res => res.json()).then(setProducts))
        .catch(() => {})
    }
    setCosts([...costs, newItem])
    setNewEntries(prev => ({
      ...prev,
      [category]: {
        name: '',
        unitType: 'kilo',
        price: 0,
        vat: defaultVatForCategory(category),
        quantity: 0,
      }
    }))
  }

  const saveEmpanada = async () => {
    if (!name) return
    const exists = saved.some(e => e.name === name)
    if (exists && !confirm('Ya existe una empanada con ese nombre. ¿Desea sobrescribirla?')) {
      return
    }
    const payload: Empanada = {
      name,
      costs: costs.map(({ isEditing, price, quantity, ...rest }) => ({
        ...rest,
        cost: price * quantity,
      })),
      margin,
    }
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
    setCosts(emp.costs.map(c => ({
      id: c.id,
      category: c.category,
      label: c.label,
      price: c.cost,
      quantity: 1,
      vat: c.vat,
      isEditing: false
    })))
    setMargin(emp.margin)
    setShowTotals(false)
    toast.success('Empanada cargada', { style: { background: '#16a34a', color: '#fff' } })
  }

  const total = costs.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const vatTotal = costs.reduce(
    (sum, item) => sum + item.price * item.quantity * (item.vat || 0) / 100,
    0
  )
  const totalWithVat = total + vatTotal
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
                <th className="pb-1">IVA (%)</th>
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
                          value={item.quantity}
                          step="0.0001"
                          onChange={e => handleQuantityChange(item.id, parseFloat(e.target.value))}
                          className="border rounded px-2 py-1 w-24"
                        />
                        <span className="ml-2">{(item.price * item.quantity).toFixed(4)}</span>
                      </>
                    ) : (
                      (item.price * item.quantity).toFixed(4)
                    )}
                  </td>
                  <td>
                    {item.isEditing ? (
                      <>
                        <input
                          type="number"
                          value={item.vat}
                          step="0.01"
                          onChange={e => handleVatChange(item.id, parseFloat(e.target.value))}
                          className="border rounded px-2 py-1 w-16"
                        />
                        <button onClick={() => toggleEdit(item.id)} className="ml-2 bg-blue-600 text-white px-2 py-1 rounded">Guardar</button>
                      </>
                    ) : (
                      <>
                        {item.vat}
                        <button onClick={() => toggleEdit(item.id)} className="ml-2 bg-blue-600 text-white px-2 py-1 rounded">Editar</button>
                        <button onClick={() => deleteItem(item.id)} className="ml-2 bg-red-600 text-white px-2 py-1 rounded">Borrar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="align-top">
                  <select
                    value={newEntries[cat]?.productName || ''}
                    onChange={e => handleProductSelect(cat, e.target.value)}
                    className="border rounded px-2 py-1 mr-2"
                  >
                    <option value="">Nuevo producto...</option>
                    {products
                      .filter(p => !costs.some(c => c.label === p.name))
                      .map(p => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                  {!newEntries[cat]?.productName && (
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={newEntries[cat]?.name || ''}
                      onChange={e => handleNewEntryChange(cat, 'name', e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  )}
                </td>
                <td>
                  {newEntries[cat]?.productName ? (
                    <>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Cantidad"
                        value={newEntries[cat]?.quantity || 0}
                        onChange={e => handleNewEntryChange(cat, 'quantity', parseFloat(e.target.value))}
                        className="border rounded px-2 py-1 w-24"
                      />
                      <span className="ml-2 text-sm">{newEntries[cat]?.unitType}</span>
                    </>
                  ) : (
                    <>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Precio"
                        value={newEntries[cat]?.price || 0}
                        onChange={e => handleNewEntryChange(cat, 'price', parseFloat(e.target.value))}
                        className="border rounded px-2 py-1 w-24"
                      />
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Cantidad"
                        value={newEntries[cat]?.quantity || 0}
                        onChange={e => handleNewEntryChange(cat, 'quantity', parseFloat(e.target.value))}
                        className="border rounded px-2 py-1 w-24 ml-2"
                      />
                      <select
                        value={newEntries[cat]?.unitType || 'kilo'}
                        onChange={e => handleNewEntryChange(cat, 'unitType', e.target.value as any)}
                        className="border rounded px-2 py-1 ml-2"
                      >
                        <option value="kilo">kilo</option>
                        <option value="envase">envase</option>
                        <option value="unidad">unidad</option>
                        <option value="metro">metro</option>
                      </select>
                    </>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="IVA"
                    value={newEntries[cat]?.vat ?? defaultVatForCategory(cat)}
                    onChange={e => handleNewEntryChange(cat, 'vat', parseFloat(e.target.value))}
                    className="border rounded px-2 py-1 w-16"
                  />
                  {newEntries[cat]?.productName && (
                    <span className="ml-2 text-sm">
                      Coste:{' '}
                      {((newEntries[cat].price || 0) * (newEntries[cat].quantity || 0)).toFixed(4)}
                      €
                    </span>
                  )}
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
          <p>IVA total: {vatTotal.toFixed(4)} €</p>
          <p>Total con IVA: {totalWithVat.toFixed(4)} €</p>
          <p>Precio de venta: {sellingPrice.toFixed(4)} €</p>
          <p>Beneficio: {profit.toFixed(4)} €</p>
        </div>
      )}

    </div>
  )
}
