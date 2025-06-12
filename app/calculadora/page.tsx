"use client"
import { useState, useEffect, ChangeEvent } from 'react'
import { createWorkbookFromObjects, downloadWorkbook } from '../../lib/exportExcel'
import ProductEditModal from '../../components/ProductEditModal'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

interface CostItem {
  id: string
  category: string
  label: string
  price: number
  quantity: number
  vat: number
  unitType: UnitType
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

const ORDERED_CATEGORIES: Category[] = [
  'Relleno',
  'Masa',
  'Horneado',
  'Envasado y Etiquetado',
  'Mano de obra',
]

type UnitType = 'kilo' | 'envase' | 'unidad' | 'metro' | 'litro'

interface Product {
  name: string
  unitType: UnitType
  price: number
  vat: number
  category?: Category
}

interface NewEntry {
  productName?: string
  quantity: number
}

const initialCosts = [
  { id: 'carne', category: 'Relleno', label: 'Carne', price: 1.95, quantity: 1, vat: 10, unitType: 'kilo' },
  { id: 'cebolla', category: 'Relleno', label: 'Cebolla', price: 0.8, quantity: 1, vat: 10, unitType: 'kilo' },
  { id: 'azafran', category: 'Relleno', label: 'Azafrán', price: 0.025, quantity: 1, vat: 10, unitType: 'kilo' },
  { id: 'sal_relleno', category: 'Relleno', label: 'Sal', price: 0.0048, quantity: 1, vat: 10, unitType: 'kilo' },
  { id: 'azucar', category: 'Relleno', label: 'Azúcar', price: 0.012, quantity: 1, vat: 10, unitType: 'kilo' },
  { id: 'aceite_relleno', category: 'Relleno', label: 'Aceite', price: 0.08, quantity: 1, vat: 10, unitType: 'kilo' },
  { id: 'gas_cocina', category: 'Relleno', label: 'Gas cocina', price: 0.026, quantity: 1, vat: 10, unitType: 'unidad' },

  { id: 'harina', category: 'Masa', label: 'Harina', price: 0.112, quantity: 1, vat: 10, unitType: 'kilo' },
  { id: 'aceite_masa', category: 'Masa', label: 'Aceite', price: 0.088, quantity: 1, vat: 10, unitType: 'kilo' },
  { id: 'margarina', category: 'Masa', label: 'Margarina vegetal', price: 0.031, quantity: 1, vat: 10, unitType: 'kilo' },
  { id: 'sal_masa', category: 'Masa', label: 'Sal', price: 0.0008, quantity: 1, vat: 10, unitType: 'kilo' },
  { id: 'levadura', category: 'Masa', label: 'Levadura', price: 0.0088, quantity: 1, vat: 10, unitType: 'kilo' },
  { id: 'electricidad_amasadora', category: 'Masa', label: 'Electricidad amasadora', price: 0.0358, quantity: 1, vat: 10, unitType: 'unidad' },

  { id: 'bano_huevo', category: 'Horneado', label: 'Baño de huevo', price: 0.076, quantity: 1, vat: 10, unitType: 'unidad' },
  { id: 'gas_horno', category: 'Horneado', label: 'Gas horno', price: 0.231, quantity: 1, vat: 10, unitType: 'unidad' },

  { id: 'papel_kraft', category: 'Envasado y Etiquetado', label: 'Papel kraft base', price: 0.11, quantity: 1, vat: 21, unitType: 'unidad' },
  { id: 'bandeja_carton', category: 'Envasado y Etiquetado', label: 'Bandeja cartón', price: 0.09, quantity: 1, vat: 21, unitType: 'unidad' },
  { id: 'sobre_papel', category: 'Envasado y Etiquetado', label: 'Sobre papel', price: 0.028, quantity: 1, vat: 21, unitType: 'unidad' },
  { id: 'plastico_film', category: 'Envasado y Etiquetado', label: 'Plástico film', price: 0.0025, quantity: 1, vat: 21, unitType: 'metro' },
  { id: 'etiqueta_caja', category: 'Envasado y Etiquetado', label: 'Etiqueta caja', price: 0.034, quantity: 1, vat: 21, unitType: 'unidad' },
  { id: 'folio_direccion', category: 'Envasado y Etiquetado', label: 'Folio etiqueta dirección', price: 0.0043, quantity: 1, vat: 21, unitType: 'unidad' },
  { id: 'toner', category: 'Envasado y Etiquetado', label: 'Tóner impresora', price: 0.0234, quantity: 1, vat: 21, unitType: 'unidad' },
  { id: 'cinta_adhesiva', category: 'Envasado y Etiquetado', label: 'Cinta adhesiva embalaje', price: 0.001, quantity: 1, vat: 21, unitType: 'unidad' },

  { id: 'mano_de_obra', category: 'Mano de obra', label: 'Mano de obra', price: 0.72, quantity: 1, vat: 21, unitType: 'unidad' }
]

const defaultVatForCategory = (category: string) =>
  ['Relleno', 'Masa', 'Horneado'].includes(category) ? 10 : 21

const calculateCost = (item: CostItem) => {
  const qty =
    item.unitType === 'envase' || item.unitType === 'unidad'
      ? Math.round(item.quantity)
      : item.quantity
  return item.price * qty
}

export default function Home() {
  const [costs, setCosts] = useState<CostItem[]>(initialCosts)
  const [margin, setMargin] = useState<number>(0)
  const [showTotals, setShowTotals] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [saved, setSaved] = useState<Empanada[]>([])
  const [selected, setSelected] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [newEntries, setNewEntries] = useState<Record<string, NewEntry>>({})
  const [modalProduct, setModalProduct] = useState<Product | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [dirty, setDirty] = useState<boolean>(false)
  const [loadedEmpanada, setLoadedEmpanada] = useState<Empanada | null>(null)
  const [pendingAction, setPendingAction] = useState<{ href?: string; emp?: Empanada } | null>(null)
  const [showExitModal, setShowExitModal] = useState<boolean>(false)

  const deleteItem = (id: string) => {
    if (confirm('¿Eliminar concepto?')) {
      setCosts(costs.filter(item => item.id !== id))
      setDirty(true)
    }
  }

  const fetchProducts = () => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(list => setProducts(list))
      .catch(() => {})
  }

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    (window as any).calculatorDirty = dirty
  }, [dirty])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  useEffect(() => {
    const handler = (e: any) => {
      const detail = e.detail as { href?: string }
      requestNavigation({ href: detail.href })
    }
    window.addEventListener('calculator:navigate', handler)
    return () => window.removeEventListener('calculator:navigate', handler)
  }, [dirty, saved])

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
            return
          }
        }
        if (list.length > 0) {
          loadEmpanada(list[0])
          setName(list[0].name)
        } else {
          toast.info('No hay empanadas guardadas. Usando valores por defecto', {
            style: { background: '#2563eb', color: '#fff' },
          })
        }
      })
      .catch(() => {})

    fetchProducts()
    window.addEventListener('focus', fetchProducts)
    return () => window.removeEventListener('focus', fetchProducts)
  }, [])

  const handleQuantityChange = (id: string, value: number) => {
    setCosts(costs.map(item => {
      if (item.id !== id) return item
      const qty =
        item.unitType === 'envase' || item.unitType === 'unidad'
          ? Math.round(value)
          : value
      return { ...item, quantity: qty }
    }))
    setDirty(true)
  }


  useEffect(() => {
    setCosts(current =>
      current.map(item => {
        const prod = products.find(p => p.name === item.label)
        if (prod) {
          return { ...item, price: prod.price, unitType: prod.unitType }
        }
        return item
      })
    )
  }, [products])

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
    setNewEntries(prev => ({
      ...prev,
      [category]: name ? { productName: name, quantity: 1 } : { quantity: 0 }
    }))
  }

  const addItem = (category: string) => {
    const entry = newEntries[category]
    if (!entry?.productName) return
    const prod = products.find(p => p.name === entry.productName)
    if (!prod) return
    const newItem: CostItem = {
      id: `${category.toLowerCase()}_${Date.now()}`,
      category,
      label: prod.name,
      price: prod.price,
      quantity: entry.quantity,
      unitType: prod.unitType,
      vat: prod.vat,
    }
    setCosts([...costs, newItem])
    setDirty(true)
    setNewEntries(prev => ({
      ...prev,
      [category]: { quantity: 0 }
    }))
  }

  const saveEmpanada = async (overrideName?: string, skipConfirm?: boolean) => {
    const empName = overrideName ?? name
    if (!empName) return
    const exists = saved.some(e => e.name === empName)
    if (!skipConfirm && exists && !confirm('Ya existe una empanada con ese nombre. ¿Desea sobrescribirla?')) {
      return
    }
    const payload: Empanada = {
      name: empName,
      costs: costs.map(item => ({
        ...item,
        cost: calculateCost(item),
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
      const savedEmp = list.find(e => e.name === empName)
      if (savedEmp) {
        setLoadedEmpanada(savedEmp)
        setName(empName)
      }
      setDirty(false)
    } catch {
      toast.error('Error al guardar', { style: { background: '#dc2626', color: '#fff' } })
    }
  }

  const loadEmpanada = (emp: Empanada) => {
    setCosts(emp.costs.map(c => ({
      id: c.id,
      category: c.category,
      label: c.label,
      price: c.price ?? c.cost,
      quantity: c.quantity ?? 1,
      unitType: c.unitType ?? 'unidad',
      vat: c.vat,
    })))
    setMargin(emp.margin)
    setShowTotals(false)
    setLoadedEmpanada(emp)
    setDirty(false)
    toast.success('Empanada cargada', { style: { background: '#16a34a', color: '#fff' } })
  }

  const requestNavigation = (action: { href?: string; emp?: Empanada }) => {
    if (dirty) {
      setPendingAction(action)
      setShowExitModal(true)
    } else {
      if (action.href) router.push(action.href)
      if (action.emp) {
        loadEmpanada(action.emp)
        setName(action.emp.name)
      }
    }
  }

  const total = costs.reduce((sum, item) => sum + calculateCost(item), 0)
  const vatTotal = costs.reduce(
    (sum, item) => sum + calculateCost(item) * (item.vat || 0) / 100,
    0
  )
  const totalWithVat = total + vatTotal
  const sellingPrice = totalWithVat * (1 + (margin || 0) / 100)
  const profit = sellingPrice - totalWithVat

  const categories = ORDERED_CATEGORIES

  return (

    <div className="p-6 mt-6 font-sans max-w-screen-lg mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{name && `${name} - `}Calculadora de Costes de Empanadas</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre de empanada"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value)
            setDirty(true)
          }}
          className="border rounded px-2 py-1"
        />
        <button onClick={saveEmpanada} className="ml-2 bg-green-600 text-white px-3 py-1 rounded">Guardar empanada</button>
        {loadedEmpanada && (
          <button
            onClick={() => saveEmpanada(loadedEmpanada.name, true)}
            className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
          >
            Actualizar empanada
          </button>
        )}
      </div>

      <div className="mb-4">
        <select
          value={selected}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelected(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Cargar empanada...</option>
          {saved.map(emp => (
            <option key={emp.name} value={emp.name}>{emp.name}</option>
          ))}
        </select>
        <button
          onClick={() => {
            const emp = saved.find(e => e.name === selected)
            if (emp) requestNavigation({ emp })
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
                <th className="pb-1">Cantidad</th>
                <th className="pb-1">Medida</th>
                <th className="pb-1">Precio</th>
                <th className="pb-1">Costo</th>
                <th className="pb-1">IVA (%)</th>
                <th className="pb-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {costs.filter(c => c.category === cat).map(item => (

                <tr key={item.id}>
                  <td>{item.label}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      step={item.unitType === 'envase' || item.unitType === 'unidad' ? 1 : 0.0001}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleQuantityChange(item.id, parseFloat(e.target.value))}
                      className="border rounded px-2 py-1 w-24"
                    />
                  </td>
                  <td>{item.unitType}</td>
                  <td>{item.price.toFixed(4)}</td>
                  <td>{calculateCost(item).toFixed(4)}</td>
                  <td>{item.vat}</td>
                  <td>
                    <button
                      onClick={() => {
                        const prod = products.find(p => p.name === item.label)
                        if (prod) {
                          setModalProduct(prod)
                          setShowModal(true)
                        }
                      }}
                      className="ml-2 bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button onClick={() => deleteItem(item.id)} className="ml-2 bg-red-600 text-white px-2 py-1 rounded">Borrar</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="align-top">
                  <select
                    value={newEntries[cat]?.productName || ''}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleProductSelect(cat, e.target.value)}
                    className="border rounded px-2 py-1 mr-2"
                  >
                    <option value="">Añadir producto...</option>
                    {products
                      .filter(p => p.category === cat && !costs.some(c => c.label === p.name))
                      .map(p => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </td>
                <td>
                  {newEntries[cat]?.productName && (
                    <input
                      type="number"
                      step={(() => {
                        const prod = products.find(p => p.name === newEntries[cat]?.productName)
                        return prod && (prod.unitType === 'envase' || prod.unitType === 'unidad') ? 1 : 0.0001
                      })()}
                      value={newEntries[cat]?.quantity || 0}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleNewEntryChange(cat, 'quantity', parseFloat(e.target.value))}
                      className="border rounded px-2 py-1 w-24"
                    />
                  )}
                </td>
                <td>
                  {(() => {
                    const prod = products.find(p => p.name === newEntries[cat]?.productName)
                    return prod ? prod.unitType : ''
                  })()}
                </td>
                <td>
                  {(() => {
                    const prod = products.find(p => p.name === newEntries[cat]?.productName)
                    return prod ? prod.price.toFixed(4) : ''
                  })()}
                </td>
                <td>
                  {(() => {
                    const prod = products.find(p => p.name === newEntries[cat]?.productName)
                    if (!prod) return ''
                    const qty =
                      prod.unitType === 'envase' || prod.unitType === 'unidad'
                        ? Math.round(newEntries[cat]?.quantity || 0)
                        : newEntries[cat]?.quantity || 0
                    return (prod.price * qty).toFixed(4)
                  })()}
                </td>
                <td>
                  {(() => {
                    const prod = products.find(p => p.name === newEntries[cat]?.productName)
                    return prod ? prod.vat : ''
                  })()}
                </td>
                <td>
                  <button
                    onClick={() => addItem(cat)}
                    className="ml-2 bg-green-600 text-white px-2 py-1 rounded"
                    disabled={!newEntries[cat]?.productName}
                  >
                    Añadir
                  </button>
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
            onChange={e => {
              setMargin(parseFloat(e.target.value))
              setDirty(true)
            }}
          />
        </label>
      </div>


      <button onClick={() => setShowTotals(true)} className="mt-4 bg-green-700 text-white px-4 py-2 rounded">
        Obtener gastos y beneficios
      </button>
      <button
        onClick={() => {
          const rows = costs.map(c => ({
            Categoria: c.category,
            Concepto: c.label,
            Cantidad: c.quantity,
            Medida: c.unitType,
            Precio: c.price,
            Coste: calculateCost(c),
            IVA: c.vat,
          }))
          rows.push({})
          rows.push({ Concepto: 'Total', Coste: total })
          rows.push({ Concepto: 'IVA total', Coste: vatTotal })
          rows.push({ Concepto: 'Total con IVA', Coste: totalWithVat })
          rows.push({ Concepto: 'Margen (%)', Coste: margin })
          rows.push({ Concepto: 'Precio de venta', Coste: sellingPrice })
          rows.push({ Concepto: 'Beneficio', Coste: profit })
          const wb = createWorkbookFromObjects(rows, name || 'Empanada')
          downloadWorkbook(wb, (name || 'empanada') + '.xlsx')
        }}
        className="mt-4 ml-2 bg-blue-700 text-white px-4 py-2 rounded"
      >
        Descargar empanada
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

      {showModal && modalProduct && (
        <ProductEditModal
          product={modalProduct}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            fetchProducts()
            setShowModal(false)
          }}
        />
      )}

      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-80">
            <p className="mb-4">Tiene cambios sin guardar. ¿Qué desea hacer?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={async () => {
                  await saveEmpanada()
                  setShowExitModal(false)
                  if (pendingAction?.href) router.push(pendingAction.href)
                  if (pendingAction?.emp) {
                    loadEmpanada(pendingAction.emp)
                    setName(pendingAction.emp.name)
                  }
                  setPendingAction(null)
                }}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Actualizar
              </button>
              <button
                onClick={async () => {
                  const newName = prompt('Nombre para la nueva empanada', name)
                  if (!newName) return
                  await saveEmpanada(newName)
                  setShowExitModal(false)
                  if (pendingAction?.href) router.push(pendingAction.href)
                  if (pendingAction?.emp) {
                    loadEmpanada(pendingAction.emp)
                    setName(pendingAction.emp.name)
                  }
                  setPendingAction(null)
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Guardar como nueva
              </button>
              <button onClick={() => { setShowExitModal(false); setPendingAction(null) }} className="px-3 py-1 rounded bg-gray-300">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
