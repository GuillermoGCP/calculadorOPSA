'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const inside = pathname !== '/'

  const handleNav = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/calculadora' && (window as any).calculatorDirty) {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('calculator:navigate', { detail: { href } }))
    }
  }

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
              onClick={e => handleNav('/calculadora', e)}
              className={`mr-4 hover:underline ${isActive('/calculadora') ? 'text-yellow-200 font-bold' : ''}`}
            >
              Calculadora
            </Link>
            <Link
              href="/empanadas"
              onClick={e => handleNav('/empanadas', e)}
              className={`mr-4 hover:underline ${isActive('/empanadas') ? 'text-yellow-200 font-bold' : ''}`}
            >
              Ver empanadas guardadas
            </Link>
            <Link
              href="/productos"
              onClick={e => handleNav('/productos', e)}
              className={`mr-4 hover:underline ${isActive('/productos') ? 'text-yellow-200 font-bold' : ''}`}
            >
              Productos
            </Link>
            <Link
              href="/registro"
              onClick={e => handleNav('/registro', e)}
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
