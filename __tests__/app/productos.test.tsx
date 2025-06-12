import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductosPage from '../../app/productos/page'
import { toast } from 'react-toastify'

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: () => null }),
  useRouter: () => ({ push: jest.fn() })
}))

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
  ToastContainer: () => null,
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(global.fetch as any) = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve([]) })
  )
  localStorage.clear()
})

describe('ProductosPage category addition', () => {
  it('prevents duplicate categories', async () => {
    const user = userEvent.setup()
    render(<ProductosPage />)
    const input = screen.getAllByLabelText('Nombre')[0]
    await user.type(input, 'Relleno')
    const button = screen.getByRole('button', { name: 'Añadir' })
    const select = screen.getByLabelText('Categoría') as HTMLSelectElement
    const initialCount = select.options.length
    await user.click(button)
    expect(select.options.length).toBe(initialCount)
    expect((toast.error as jest.Mock).mock.calls[0][0]).toBe('La categoría ya existe')
  })

  it('layouts form and list responsively', () => {
    const { container } = render(<ProductosPage />)
    const formDiv = container.querySelector('div[class*=\"md:w-1/3\"]')
    const listDiv = container.querySelector('div[class*=\"md:w-2/3\"]')
    expect(formDiv).toBeInTheDocument()
    expect(listDiv).toBeInTheDocument()
    expect(formDiv?.parentElement).toBe(listDiv?.parentElement)
    const parentClass = formDiv?.parentElement?.className || ''
    expect(parentClass).toContain('md:flex')
    expect(parentClass).toContain('flex-col')
  })
})
