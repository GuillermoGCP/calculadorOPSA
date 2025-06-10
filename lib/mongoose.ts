import mongoose from 'mongoose'

const URI = process.env.MONGO_URI as string

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return
  }
  try {
    if (!URI) {
      throw new Error('MONGO_URI not defined')
    }
    console.log('Conectando a MongoDB...', URI)
    const conn = await mongoose.connect(URI, {
      dbName: 'calculadoraOPSA',
    })
    console.log(`MongoDB conectado: ${conn.connection.host}`)
  } catch (error: any) {
    console.error(`Error de conexión a MongoDB: ${error.message}`)
    throw error
  }
}

export default connectDB
