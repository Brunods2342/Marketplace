'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function CreateAdModal({ isOpen, onClose, onCreated }) {
  const { user } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ehDoacao, setEhDoacao] = useState(false);
  const [preco, setPreco] = useState('');
  const [urlImagem, setUrlImagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const categorias = [
    { id: '1', nome: 'Eletrônicos' },
    { id: '2', nome: 'Papelaria' },
    { id: '3', nome: 'Masculino Vestimenta' },
    { id: '4', nome: 'Feminino Vestimento' },
    { id: '5', nome: 'Acessórios' },
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!user) {
      setErro('Você precisa estar logado para criar um anúncio.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/anuncios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          descricao,
          preco: ehDoacao ? null : parseFloat(preco),
          eh_doacao: ehDoacao,
          id_categoria: idCategoria,
          id_profiles: user.id_profiles,
          urls_imagem: urlImagem ? [urlImagem] : []
        })
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        onCreated();
        onClose();
      } else {
        setErro(data.message || 'Erro ao publicar anúncio.');
      }
    } catch (err) {
      setErro('Erro de conexão ao criar anúncio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-black">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Publicar Novo Anúncio</h2>

        {erro && <p className="bg-red-100 text-red-700 p-2.5 rounded-lg text-xs font-semibold mb-4">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Título do Anúncio</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Caderno Universitário Unifor"
              className="w-full p-2.5 border rounded-lg text-sm bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Categoria</label>
              <select
                required
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              >
                <option value="">Selecione...</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Tipo de Anúncio</label>
              <label className="flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer bg-gray-50">
                <input
                  type="checkbox"
                  checked={ehDoacao}
                  onChange={(e) => setEhDoacao(e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-semibold">É Doação?</span>
              </label>
            </div>
          </div>

          {!ehDoacao && (
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                required={!ehDoacao}
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="0.00"
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase mb-1">URL da Imagem</label>
            <input
              type="url"
              value={urlImagem}
              onChange={(e) => setUrlImagem(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full p-2.5 border rounded-lg text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Descrição</label>
            <textarea
              required
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o estado do item, local de entrega, etc."
              className="w-full p-2.5 border rounded-lg text-sm bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition"
            >
              {loading ? 'Publicando...' : 'Publicar Anúncio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}