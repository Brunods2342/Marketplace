'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensagem, setMensagem] = useState('')

  // Função para cadastrar novo usuário
  async function handleSignUp(e) {
    e.preventDefault()
    setMensagem('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMensagem(`Erro no cadastro: ${error.message}`)
    } else {
      setMensagem('Cadastro realizado! Verifique seu e-mail para confirmar.')
    }
  }

  // Função para fazer login
  async function handleSignIn(e) {
    e.preventDefault()
    setMensagem('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMensagem(`Erro no login: ${error.message}`)
    } else {
      setMensagem('Login efetuado com sucesso!')
    }
  }

  // Função para fazer logout
  async function handleSignOut() {
    await supabase.auth.signOut()
    setMensagem('Você saiu da conta.')
  }

  if (loading) return <p>Carregando...</p>

  // Se o usuário já estiver logado
  if (user) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Bem-vindo(a), {user.email}!</h2>
        <button onClick={handleSignOut}>Sair da Conta</button>
      </div>
    )
  }

  // Formulário de login/cadastro
  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <h1>Autenticação Marketplace</h1>

      <form>
        <div style={{ marginBottom: '10px' }}>
          <label>E-mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button type="button" onClick={handleSignIn}>
            Entrar
          </button>
          <button type="button" onClick={handleSignUp}>
            Cadastrar
          </button>
        </div>
      </form>

      {mensagem && <p style={{ marginTop: '15px', color: 'blue' }}>{mensagem}</p>}
    </div>
  )
}