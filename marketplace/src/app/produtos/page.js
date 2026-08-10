'use client';

import { useState, useEffect } from 'react';
import Product from '@/components/Product';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados dos filtros
  const [categoria, setCategoria] = useState('');
  const [minPreco, setMinPreco] = useState('');
  const [maxPreco, setMaxPreco] = useState('');

  // As 4 categorias permitidas para filtro
  const categoriasPermitidas = [
    'Eletrônicos',
    'Papelaria',
    'Masculino Vestimenta',
    'Feminino Vestimento',
  ];

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
        setProdutos(data.data || []);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, [categoria]); // Dispara busca automatica ao selecionar uma categoria

  const handleLimparFiltros = () => {
    setCategoria('');
    setMinPreco('');
    setMaxPreco('');
    fetch('/api/anuncios')
      .then((res) => res.json())
      .then((data) => setProdutos(data.data || []));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-6 text-black">Mecanismo de Busca</h1>

      {/* Formulário de Busca e Filtro */}
      <div className="bg-white p-4 rounded-xl border shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Campo de Seleção de Categoria com apenas as 4 opções */}
        <div>
          <label className="block text-xs font-semibold uppercase text-black mb-1">
            Categoria
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as categorias</option>
            {categoriasPermitidas.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-black mb-1">
            Preço Mínimo
          </label>
          <input
            type="number"
            placeholder="R$ 0"
            value={minPreco}
            onChange={(e) => setMinPreco(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm text-black"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-black mb-1">
            Preço Máximo
          </label>
          <input
            type="number"
            placeholder="R$ 1000"
            value={maxPreco}
            onChange={(e) => setMaxPreco(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm text-black"
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
            onClick={handleLimparFiltros}
            className="px-4 bg-gray-200 text-black font-medium rounded-lg hover:bg-gray-300 transition text-sm"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Renderização da Lista via componente Product */}
      {loading ? (
        <p className="text-center text-black py-12">Carregando anúncios...</p>
      ) : produtos.length === 0 ? (
        <p className="text-center text-black py-12">Nenhum produto encontrado nesta categoria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <Product key={produto.id_produto} produto={produto} />
          ))}
        </div>
      )}
    </div>
  );
}