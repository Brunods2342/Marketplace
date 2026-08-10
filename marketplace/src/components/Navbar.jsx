'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';
import CreateAdModal from './CreateAdModal';

export default function Navbar({ onAdCreated }) {
  const { user, logout } = useAuth();
  const [busca, setBusca] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [createAdModalOpen, setCreateAdModalOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (busca.trim()) {
      router.push(`/produtos?categoria=${encodeURIComponent(busca.trim())}`);
    } else {
      router.push('/produtos');
    }
  };

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm text-black">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Esquerda: Logo */}
          <Link href="/" className="text-xl font-black text-blue-600 tracking-tight shrink-0">
            MARKET<span className="text-black">PLACE</span>
          </Link>

          {/* Centro: Campo de Pesquisa */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por categoria ou produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition text-black"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Direita: Links e Modais */}
          <nav className="flex items-center gap-3 shrink-0">
            <Link 
              href="/produtos" 
              className="text-black hover:text-blue-600 font-medium text-sm transition hidden sm:block"
            >
              Todos os Produtos
            </Link>

            {user ? (
              <>
                <button
                  onClick={() => setCreateAdModalOpen(true)}
                  className="bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  + Anunciar
                </button>
                <span className="text-xs font-semibold px-3 py-2 bg-gray-100 rounded-lg text-black">
                  Olá, {user.nome}
                </span>
                <button
                  onClick={logout}
                  className="text-xs text-red-600 hover:underline font-bold"
                >
                  Sair
                </button>
              </>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Entrar / Cadastrar
              </button>
            )}
          </nav>

        </div>
      </header>

      {/* Pop-ups acionados pela Navbar */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
      <CreateAdModal 
        isOpen={createAdModalOpen} 
        onClose={() => setCreateAdModalOpen(false)} 
        onCreated={onAdCreated} 
      />
    </>
  );
}