import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, TextInput, Alert, Card } from '@ui'
import { useAuth } from '../../context/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username, password)
      navigate('/visitors')
    } catch (err) {
      setError('Kullanıcı adı veya şifre hatalı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card title="VMS Giriş" className="w-full max-w-sm">

        <img
          src="/cybersoft_logo.png"
          alt="Logo"
          className="w-40 h-40 object-contain mx-auto mb-6"
        />

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && <Alert tone="danger">{error}</Alert>}
          <TextInput
            label="Kullanıcı adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <TextInput
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Button type="submit" loading={loading} fullWidth>
            Giriş Yap
          </Button>
        </form>
      </Card>
    </div>
  )
}
