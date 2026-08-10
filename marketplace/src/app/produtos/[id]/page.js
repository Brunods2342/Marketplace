'use client';

import { useState, useEffect } from 'react';
import Product from '@/components/Product';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoria, setCategoria] = useState('');
  const [minPreco, setMinPreco] = useState('');
  const [maxPreco, setMaxPreco] = useState('');

  // Adicionada a categoria "Acessórios"
  const categoriasPermitidas = [
    'Eletrônicos',
    'Papelaria',
    'Masculino Vestimenta',
    'Feminino Vestimento',
    'Acessórios',
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
        let lista = data.data || [];

        if (categoria) {
          lista = lista.filter((p) => {
            const catNome = typeof p.categoria === 'object' ? p.categoria?.nome : p.categoria;
            return catNome?.toLowerCase() === categoria.toLowerCase();
          });
        }

        if (minPreco) {
          lista = lista.filter((p) => Number(p.preco) >= parseFloat(minPreco));
        }

        if (maxPreco) {
          lista = lista.filter((p) => Number(p.preco) <= parseFloat(maxPreco));
        }

        setProdutos(lista);
      }
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, [categoria]);

  const handleLimparFiltros = () => {
    setCategoria('');
    setMinPreco('');
    setMaxPreco('');
    fetch('/api/anuncios')
      .then((res) => res.json())
      .then((data) => setProdutos(data.data || []));
  };

  const temFiltroAtivo = categoria || minPreco || maxPreco;
  const getNomeCat = (p) => (typeof p.categoria === 'object' ? p.categoria?.nome : p.categoria);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-6 text-black">Mecanismo de Busca</h1>

      {/* Painel de Filtros */}
      <div className="bg-white p-4 rounded-xl border shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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

      {/* Exibição dos Resultados */}
      {loading ? (
        <p className="text-center text-black py-12">Filtrando produtos...</p>
      ) : produtos.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-gray-50">
          <p className="text-black font-medium">Nenhum produto encontrado com os filtros selecionados.</p>
          <button
            onClick={handleLimparFiltros}
            className="mt-2 text-sm text-blue-600 underline font-semibold"
          >
            Limpar Filtros
          </button>
        </div>
      ) : temFiltroAtivo ? (
        <div>
          <p className="text-sm text-black font-semibold mb-4">
            Exibindo {produtos.length} {produtos.length === 1 ? 'resultado' : 'resultados'}:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtos.map((produto) => (
              <Product key={produto.id_produto} produto={produto} />
            ))}
          </div>
        </div>
      ) : (
        /* Seções separadas por todas as 5 categorias */
        <div className="space-y-10">
          {categoriasPermitidas.map((catNome) => {
            const produtosDaCategoria = produtos.filter(
              (p) => getNomeCat(p)?.toLowerCase() === catNome.toLowerCase()
            );

            if (produtosDaCategoria.length === 0) return null;

            return (
              <section key={catNome} className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-black border-l-4 border-blue-600 pl-3">
                    {catNome}
                  </h2>
                  <span className="text-xs text-black font-medium bg-gray-200 px-2 py-1 rounded-full">
                    {produtosDaCategoria.length} {produtosDaCategoria.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {produtosDaCategoria.map((produto) => (
                    <Product key={produto.id_produto} produto={produto} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}