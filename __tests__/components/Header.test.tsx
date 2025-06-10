import { render, screen } from '@testing-library/react'
import Header from '../../components/Header'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn() })
}))

describe('Header component', () => {
  it('renders the site title', () => {
    render(<Header />)
    expect(screen.getByText('O pan de San Antonio')).toBeInTheDocument()
  })
})
