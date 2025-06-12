import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../../components/Header'

const mockUsePathname = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ push: jest.fn() })
}))

describe('Header component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/calculadora')
  })

  it('renders the site title', () => {
    render(<Header />)
    expect(screen.getByText('O pan de San Antonio')).toBeInTheDocument()
  })

  it('toggles the mobile navigation', () => {
    render(<Header />)
    const button = screen.getByRole('button', { name: /toggle navigation/i })
    const mobileNav = screen.getByTestId('mobile-nav')

    expect(mobileNav.className).toContain('hidden')
    fireEvent.click(button)
    expect(mobileNav.className).not.toContain('hidden')
  })
})
