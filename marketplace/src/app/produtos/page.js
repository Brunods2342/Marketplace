'use client';

import { useState, useEffect } from 'react';
import Product from '@/components/Product';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoria, setCategoria] = useState('');
  const [minPreco, setMinPreco] = useState('');
  const [maxPreco, setMaxPreco] = useState('');

  const buscarProdutos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoria) params.append('categoria', categoria);
      if (minPreco) params.append('minPreco', minPreco);
      if (maxPreco) params.append('maxPreco', maxPreco);

      const res = await fetch(`/api/anuncios?${params.toString()}`);
      const data = await res.json();

      if (data.status === 'success') {
        setProdutos(data.data);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja excluir este anúncio?')) return;
    const res = await fetch(`/api/anuncios/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProdutos(produtos.filter(p => p.id !== id));
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Mecanismo de Busca</h1>

      {/* Formulário de Busca e Filtro */}
      <div className="bg-white p-4 rounded-xl border shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Categoria</label>
          <input
            type="text"
            placeholder="Ex: eletronicos"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-black text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Preço Mínimo</label>
          <input
            type="number"
            placeholder="R$ 0"
            value={minPreco}
            onChange={(e) => setMinPreco(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-black text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Preço Máximo</label>
          <input
            type="number"
            placeholder="R$ 1000"
            value={maxPreco}
            onChange={(e) => setMaxPreco(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-black text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={buscarProdutos}
            className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            Filtrar
          </button>
          <button
            onClick={() => {
              setCategoria('');
              setMinPreco('');
              setMaxPreco('');
              fetch('/api/anuncios').then(res => res.json()).then(d => setProdutos(d.data || []));
            }}
            className="px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Renderização da Lista via componente Product */}
      {loading ? (
        <p className="text-center text-gray-500 py-12">Carregando anúncios...</p>
      ) : produtos.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((produto) => (
            <Product key={produto.id} produto={produto} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}