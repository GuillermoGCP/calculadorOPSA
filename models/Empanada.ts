import mongoose, { Schema, Document, Model } from 'mongoose'

import { UnitType } from './Product'
import { CostItem } from '../types'

export interface IEmpanada extends Document {
  name: string
  costs: CostItem[]
  margin: number
}

const CostItemSchema = new Schema<CostItem>(
  {
    id: String,
    category: String,
    label: String,
    price: Number,
    quantity: Number,
    unitType: { type: String, enum: Object.values(UnitType), required: false },
    cost: Number,
    vat: Number,
  },
  { _id: false }
)

const EmpanadaSchema = new Schema<IEmpanada>({
  name: { type: String, required: true, unique: true },
  costs: [CostItemSchema],
  margin: { type: Number, required: true },
})

const Empanada =
  (mongoose.models.Empanada as Model<IEmpanada>) ||
  mongoose.model<IEmpanada>('Empanada', EmpanadaSchema)
export default Empanada
