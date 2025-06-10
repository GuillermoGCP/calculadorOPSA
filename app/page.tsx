"use client"
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showUnauthorized, setShowUnauthorized] = useState(false)

  useEffect(() => {
    if (searchParams.get('unauthorized')) {
      setShowUnauthorized(true)
      router.replace('/')
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      toast.success('Bienvenido', { style: { background: '#16a34a', color: '#fff' } })
      router.push('/calculadora')
    } else {
      toast.error('Credenciales inválidas', { style: { background: '#dc2626', color: '#fff' } })
    }
  }

  return (
    <div className="p-6 mt-6 max-w-sm mx-auto bg-white rounded-lg shadow-lg relative">
      <h1 className="text-xl font-bold mb-4 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button type="submit" className="bg-green-600 text-white py-2 rounded">
          Entrar
        </button>
      </form>

      {showUnauthorized && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="mb-4">No tienes autorización para acceder.</p>
            <button
              onClick={() => setShowUnauthorized(false)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
