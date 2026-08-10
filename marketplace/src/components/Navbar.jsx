'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [busca, setBusca] = useState('');
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
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Esquerda: Logo */}
        <Link href="/" className="text-xl font-black text-blue-600 tracking-tight shrink-0">
          MARKET<span className="text-gray-800">PLACE</span>
        </Link>

        {/* Centro: Campo de Pesquisa */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por categoria ou produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
            >
              🔍
            </button>
          </div>
        </form>

        {/* Direita: Links Nativos */}
        <nav className="flex items-center gap-4 shrink-0">
          <Link 
            href="/produtos" 
            className="text-gray-600 hover:text-blue-600 font-medium text-sm transition hidden sm:block"
          >
            Todos os Produtos
          </Link>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Entrar
          </Link>
        </nav>

      </div>
    </header>
  );
}