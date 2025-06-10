import { GET, POST, DELETE } from '../../app/api/productos/route'
import Product from '../../models/Product'
import connectDB from '../../lib/mongoose'

jest.mock('../../lib/mongoose')
jest.mock('../../models/Product', () => ({
  find: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn()
}))

const mockedProduct = Product as jest.Mocked<typeof Product>

describe('product API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET returns list of products', async () => {
    mockedProduct.find.mockResolvedValue([{ name: 'Test' }])
    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual([{ name: 'Test' }])
  })

  it('POST upserts product', async () => {
    const req = new Request('http://localhost/api/productos', {
      method: 'POST',
      body: JSON.stringify({ name: 'New', unitType: 'unidad', price: 1, vat: 0 })
    })
    const res = await POST(req)
    expect(mockedProduct.updateOne).toHaveBeenCalled()
    expect(res.status).toBe(200)
  })

  it('DELETE removes product', async () => {
    const req = new Request('http://localhost/api/productos?name=Del', { method: 'DELETE' })
    const res = await DELETE(req)
    expect(mockedProduct.deleteOne).toHaveBeenCalledWith({ name: 'Del' })
    expect(res.status).toBe(200)
  })
})
