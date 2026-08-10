'use client';

import { useState, useEffect } from 'react';
import Product from '@/components/Product';

export default function HomePage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const res = await fetch('/api/anuncios');
        const data = await res.json();
        if (data.status === 'success') {
          setProdutos(data.data || []);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    }
    carregarProdutos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Produtos Disponíveis</h1>

      {loading ? (
        <p className="text-center py-12 text-gray-500">Carregando produtos...</p>
      ) : produtos.length === 0 ? (
        <p className="text-center py-12 text-gray-500">Nenhum produto cadastrado.</p>
      ) : (
        /* Vitrine trazendo os cards com Imagem, Nome e Preço */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <Product key={produto.id_produto} produto={produto} />
          ))}
        </div>
      )}
    </div>
  );
}