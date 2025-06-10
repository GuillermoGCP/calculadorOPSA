'use client'

import Head from 'next/head'
import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}
