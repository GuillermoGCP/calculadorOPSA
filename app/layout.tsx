import '../styles/globals.css'
import type { ReactNode } from 'react'
import Header from '../components/Header'
import ToastProvider from '../components/ToastProvider'
import '../styles/globals.css'

export const metadata = {
  title: 'Calculador OPSA',
  description: 'Calculadora para empanadas',
}
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='es'>
      <head />
      <body className='bg-gradient-to-br from-green-50 to-green-100 text-gray-900 flex flex-col min-h-screen'>
        <Header />
        <ToastProvider />
        <main className='flex-grow'>{children}</main>
        <footer className='bg-green-600 text-white py-4 text-center text-sm md:text-base'>
          <a
            href='https://opandesanantonio.com/'
            target='_blank'
            rel='noopener noreferrer'
            className='underline'
          >
            O pan de San Antonio ©
          </a>{' '}
          | Programador:{' '}
          <a
            href='https://github.com/GuillermoGCP'
            target='_blank'
            rel='noopener noreferrer'
            className='underline'
          >
            Guillermo Cerviño Porto
          </a>
        </footer>
      </body>
    </html>
  )
}
