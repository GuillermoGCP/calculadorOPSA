import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <body className="bg-gray-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
