import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProduct extends Document {
  name: string
  unitType: 'kilo' | 'envase' | 'unidad'
  price: number
  vat: number
  category?: string
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, unique: true },
  unitType: {
    type: String,
    enum: ['kilo', 'envase', 'unidad'],
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
