import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI as string

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return
  }
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI not defined')
    }
    console.log('Conectando a MongoDB...', MONGO_URI)
    const conn = await mongoose.connect(MONGO_URI, { dbName: 'calculadoraOPSA' })
    console.log(`MongoDB conectado: ${conn.connection.host}`)
  } catch (error: any) {
    console.error(`Error de conexión a MongoDB: ${error.message}`)
    throw error
  }
}

export default connectDB
