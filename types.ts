export type UnitType = 'kilo' | 'envase' | 'unidad' | 'metro' | 'litro'

export interface CostItem {
  id: string
  category: string
  label: string
  price: number
  quantity: number
  unitType?: UnitType
  vat: number
  cost?: number
}
