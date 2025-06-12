import { GET, POST, DELETE } from '../../app/api/empanadas/route'
import Empanada from '../../models/Empanada'
import connectDB from '../../lib/mongoose'

jest.mock('../../lib/mongoose')
jest.mock('../../models/Empanada', () => ({
  find: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
}))

const mockedEmpanada = Empanada as jest.Mocked<typeof Empanada>

describe('empanada API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET returns list of empanadas', async () => {
    mockedEmpanada.find.mockResolvedValue([{ name: 'Test', costs: [] }])
    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual([{ name: 'Test', costs: [] }])
  })

  it('POST upserts empanada with quantity', async () => {
    const payload = {
      name: 'New',
      costs: [
        {
          id: '1',
          category: 'Masa',
          label: 'Harina',
          price: 1,
          quantity: 2,
          unitType: 'kilo',
          cost: 2,
          vat: 10,
        },
      ],
      margin: 10,
    }
    const req = new Request('http://localhost/api/empanadas', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    const res = await POST(req)
    expect(mockedEmpanada.updateOne).toHaveBeenCalledWith(
      { name: payload.name },
      { $set: payload },
      { upsert: true }
    )
    expect(res.status).toBe(200)
  })

  it('DELETE removes empanada', async () => {
    const req = new Request('http://localhost/api/empanadas?name=Del', {
      method: 'DELETE',
    })
    const res = await DELETE(req)
    expect(mockedEmpanada.deleteOne).toHaveBeenCalledWith({ name: 'Del' })
    expect(res.status).toBe(200)
  })
})
