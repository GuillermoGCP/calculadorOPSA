'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const inside = pathname !== '/'
  return (
    <header className="bg-green-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-lg md:text-2xl font-bold">O pan de San Antonio</h1>
        {inside && (
          <nav className="text-sm md:text-base">
            <Link href="/" className="mr-4 hover:underline">Cerrar sesión</Link>
            <Link href="/empanadas" className="mr-4 hover:underline">Ver empanadas guardadas</Link>
            <Link href="/registro" className="hover:underline">Registro</Link>
          </nav>
        )}
      </div>
    </header>
  )
}
