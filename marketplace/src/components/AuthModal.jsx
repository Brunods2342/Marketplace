'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [aba, setAba] = useState('login'); // Alterna entre 'login' e 'cadastro'
  const [erro, setErro] = useState('');

  // Estados dos formulários
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // Validações locais conforme o banco de dados
    if (!email.endsWith('@edu.unifor.br')) {
      setErro('Apenas e-mails acadêmicos @edu.unifor.br são permitidos.');
      return;
    }

    if (senha.length < 8) {
      setErro('A senha deve conter no mínimo 8 caracteres.');
      return;
    }

    try {
      // Simulação do payload retornado do banco
      const userData = {
        id_profiles: crypto.randomUUID(),
        nome: aba === 'cadastro' ? nome : email.split('@')[0],
        email,
      };

      login(userData);
      
      // Limpa os campos e fecha o Pop-up
      setNome('');
      setEmail('');
      setSenha('');
      onClose();
    } catch (err) {
      setErro('Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    /* Overlay escuro com opacidade */
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      
      {/* Box Principal do Pop-up */}
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border text-black relative">
        
        {/* Botão de Fechar no Canto Superior (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl"
        >
          ✕
        </button>

        {/* Header do Pop-up / Alternador de Abas */}
        <div className="flex border-b mb-6 mt-2">
          <button
            type="button"
            onClick={() => {
              setAba('login');
              setErro('');
            }}
            className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition ${
              aba === 'login'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setAba('cadastro');
              setErro('');
            }}
            className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition ${
              aba === 'cadastro'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Exibição de Mensagem de Erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold mb-4">
            {erro}
          </div>
        )}

        {/* Formulário Dinâmico */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {aba === 'cadastro' && (
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full p-2.5 border rounded-lg text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              E-mail Acadêmico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.nome@edu.unifor.br"
              className="w-full p-2.5 border rounded-lg text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full p-2.5 border rounded-lg text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition text-sm shadow-md"
          >
            {aba === 'login' ? 'Acessar Conta' : 'Finalizar Cadastro'}
          </button>
        </form>

        {/* Footer do Pop-up */}
        <p className="text-center text-xs text-gray-500 mt-4">
          {aba === 'login' ? 'Ainda não possui conta?' : 'Já tem uma conta?'}{' '}
          <button
            type="button"
            onClick={() => {
              setAba(aba === 'login' ? 'cadastro' : 'login');
              setErro('');
            }}
            className="text-blue-600 font-bold underline ml-1"
          >
            {aba === 'login' ? 'Cadastre-se' : 'Entrar'}
          </button>
        </p>

      </div>
    </div>
  );
}