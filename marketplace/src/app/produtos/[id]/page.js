'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProdutoDetalhesPage() {
  const { id } = useParams();
  const router = useRouter();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagemSelecionada, setImagemSelecionada] = useState(0);

  useEffect(() => {
    async function fetchProduto() {
      try {
        const res = await fetch(`/api/anuncios/${id}`);
        const data = await res.json();

        if (res.ok && data.status === 'success') {
          setProduto(data.data);
        }
      } catch (err) {
        console.error('Erro ao carregar o produto:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduto();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando detalhes...</div>;
  if (!produto) return <div className="p-8 text-center text-red-500">Produto não encontrado.</div>;

  const imagens = produto.imagem_produto || [];

  return (
    <main className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
      >
        ← Voltar
      </button>

      <div className="bg-white border rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Galeria de Imagens */}
        <div>
          <div className="h-80 w-full bg-gray-100 rounded-xl overflow-hidden mb-4 border">
            {imagens.length > 0 ? (
              <img
                src={imagens[imagemSelecionada]?.url_imagem}
                alt={produto.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">Sem imagens</div>
            )}
          </div>

          {/* Miniaturas de Imagens (Até 5 fotos) */}
          {imagens.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {imagens.map((img, idx) => (
                <button
                  key={img.id_imagem || idx}
                  onClick={() => setImagemSelecionada(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    imagemSelecionada === idx ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img src={img.url_imagem} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações Detalhadas do Produto */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                {produto.categoria?.nome || 'Sem Categoria'}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(produto.data_anuncio).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mt-2">{produto.titulo}</h1>

            <div className="text-3xl font-extrabold text-emerald-600 my-4">
              {produto.eh_doacao ? 'Gratuito (Doação)' : `R$ ${Number(produto.preco).toFixed(2)}`}
            </div>

            {/* Informações de Vendedor */}
            {produto.profiles && (
              <div className="bg-gray-50 p-3 rounded-lg border my-4 text-xs text-gray-600">
                <p><strong>Anunciado por:</strong> {produto.profiles.nome}</p>
                <p><strong>Contato:</strong> {produto.profiles.email}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Descrição</h2>
              <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                {produto.descricao}
              </p>
            </div>
          </div>

          <button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition">
            Entrar em Contato com Vendedor
          </button>
        </div>

      </div>
    </main>
  );
}