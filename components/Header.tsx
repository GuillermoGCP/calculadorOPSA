'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const inside = pathname !== '/'

  const isActive = (path: string) => pathname === path

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    router.push('/')
  }
  return (
    <header className="bg-green-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-lg md:text-2xl font-bold">O pan de San Antonio</h1>
        {inside && (
          <nav className="text-sm md:text-base">
            <button onClick={logout} className="mr-4 hover:underline">Cerrar sesión</button>
            <Link
              href="/calculadora"
              className={`mr-4 hover:underline ${isActive('/calculadora') ? 'text-yellow-200 font-bold' : ''}`}
            >
              Calculadora
            </Link>
            <Link
              href="/empanadas"
              className={`mr-4 hover:underline ${isActive('/empanadas') ? 'text-yellow-200 font-bold' : ''}`}
            >
              Ver empanadas guardadas
            </Link>
            <Link
              href="/registro"
              className={`hover:underline ${isActive('/registro') ? 'text-yellow-200 font-bold' : ''}`}
            >
              Registro
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
