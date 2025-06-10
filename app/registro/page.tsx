"use client"
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function Registro() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      toast.success('Usuario registrado', { style: { background: '#16a34a', color: '#fff' } })
      setUsername('')
      setPassword('')
    } else {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error || 'Error al registrar', { style: { background: '#dc2626', color: '#fff' } })
    }
  }

  return (
    <div className="p-6 mt-6 max-w-sm mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-4 text-center">Registro</h1>
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
          Registrarse
        </button>
      </form>
    </div>
  )
}
