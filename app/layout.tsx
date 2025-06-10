import '../styles/globals.css'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-green-50 text-gray-900 flex flex-col min-h-screen">
        <header className="bg-green-600 text-white py-4 text-center text-lg md:text-2xl font-bold">
          O pan de San Antonio
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-green-600 text-white py-4 text-center text-sm md:text-base">
          <a href="https://opandesanantonio.com/" target="_blank" rel="noopener noreferrer" className="underline">
            O pan de San Antonio ©
          </a>
          {' '}| Programador:{' '}
          <a href="https://github.com/GuillermoGCP" target="_blank" rel="noopener noreferrer" className="underline">
            Guillermo Cerviño Porto
          </a>
        </footer>
      </body>
    </html>
  )
}
