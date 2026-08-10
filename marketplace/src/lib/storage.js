import { NextResponse } from 'next/server';

const STORAGE_KEY = 'marketplace_produtos_db';

export const storage = {
  // Retorna todos os produtos
  getProdutos: () => {
    if (typeof window === 'undefined') return [];
    const localData = localStorage.getItem(STORAGE_KEY);
    if (!localData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUTOS_INICIAIS));
      return PRODUTOS_INICIAIS;
    }
    return JSON.parse(localData);
  },

  // Adiciona um novo produto
  addProduto: (novoProduto) => {
    const produtos = storage.getProdutos();
    const produtoFormatado = {
      ...novoProduto,
      id_produto: crypto.randomUUID(),
      data_anuncio: new Date().toISOString()
    };
    const atualizados = [produtoFormatado, ...produtos];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
    return produtoFormatado;
  },

  // Deleta um produto por ID
  deleteProduto: (id) => {
    const produtos = storage.getProdutos();
    const filtrados = produtos.filter(p => p.id_produto !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
    return true;
  }
};