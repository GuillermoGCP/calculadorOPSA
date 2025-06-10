import { useState } from 'react'

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
  const [costs, setCosts] = useState(initialCosts)
  const [margin, setMargin] = useState(0)

  const handleCostChange = (id, value) => {
    setCosts(costs.map(item => item.id === id ? { ...item, cost: value } : item))
  }

  const total = costs.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0)
  const vat = total * 0.10
  const totalWithVat = total + vat
  const sellingPrice = totalWithVat * (1 + (parseFloat(margin) || 0) / 100)
  const profit = sellingPrice - totalWithVat

  const categories = [...new Set(costs.map(c => c.category))]

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Calculadora de Costes de Empanada de Carne</h1>
      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: '1rem' }}>
          <h2>{cat}</h2>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Concepto</th>
                <th style={{ textAlign: 'left' }}>Costo (€)</th>
              </tr>
            </thead>
            <tbody>
              {costs.filter(c => c.category === cat).map(item => (
                <tr key={item.id}>
                  <td>{item.label}</td>
                  <td>
                    <input
                      type="number"
                      value={item.cost}
                      step="0.0001"
                      onChange={e => handleCostChange(item.id, parseFloat(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div style={{ marginTop: '1rem' }}>
        <p>Total: {total.toFixed(4)} €</p>
        <p>IVA (10%): {vat.toFixed(4)} €</p>
        <p>Total con IVA: {totalWithVat.toFixed(4)} €</p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Margen de beneficio (%):
          <input
            type="number"
            value={margin}
            step="0.01"
            onChange={e => setMargin(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p>Precio de venta: {sellingPrice.toFixed(4)} €</p>
        <p>Beneficio: {profit.toFixed(4)} €</p>
      </div>
    </div>
  )
}
