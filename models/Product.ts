import mongoose, { Schema, Document, Model } from 'mongoose'

export type Category = string

export enum UnitType {
  Kilo = 'kilo',
  Envase = 'envase',
  Unidad = 'unidad',
  Metro = 'metro',
}

export interface IProduct extends Document {
  name: string
  unitType: UnitType
  price: number
  vat: number
  category?: Category
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, unique: true },
  unitType: {
    type: String,
    enum: Object.values(UnitType),
    required: true,
  },
  price: { type: Number, required: true },
  vat: { type: Number, required: true },
  category: { type: String },
})

const Product =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>('Product', ProductSchema)
export default Product
