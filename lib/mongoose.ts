import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    console.log('Conectando a MongoDB...', process.env.NEXT_PUBLIC_MONGO_URI)
    const conn = await mongoose.connect(
      process.env.NEXT_PUBLIC_MONGO_URI as string,
      {
        dbName: 'Alma-db',
      }
    )
    console.log(`MongoDB conectado: ${conn.connection.host}`)
  } catch (error: any) {
    console.error(`Error de conexión a MongoDB: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
