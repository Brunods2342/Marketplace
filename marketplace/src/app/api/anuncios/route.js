import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get('categoria');
  const minPreco = searchParams.get('minPreco');
  const maxPreco = searchParams.get('maxPreco');

  let query = supabase
    .from('produto')
    .select(`
      id_produto,
      titulo,
      descricao,
      preco,
      eh_doacao,
      data_anuncio,
      id_profiles,
      categoria:id_categoria!inner ( id_categoria, nome ),
      imagem_produto ( id_imagem, url_imagem )
    `);

  // Filtra estritamente por categoria (se informada)
  if (categoria && categoria.trim() !== '') {
    query = query.ilike('categoria.nome', `%${categoria.trim()}%`);
  }

  // Filtra por Preço Mínimo
  if (minPreco && !isNaN(parseFloat(minPreco))) {
    query = query.gte('preco', parseFloat(minPreco));
  }

  // Filtra por Preço Máximo
  if (maxPreco && !isNaN(parseFloat(maxPreco))) {
    query = query.lte('preco', parseFloat(maxPreco));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: 'success', data: data || [] });
// Faz a leitura dos dados persistidos ou em fallback
  return NextResponse.json({
    status: 'success',
    data: [] // Opcional: Integrado dinamicamente com o storage no client-side
  });

}