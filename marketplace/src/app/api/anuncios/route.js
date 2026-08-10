import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Listar todos os produtos (trazendo imagens e nome da categoria)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get('categoria');
  const minPreco = searchParams.get('minPreco');
  const maxPreco = searchParams.get('maxPreco');

  // Faz a consulta unindo a tabela produto com categoria e imagem_produto
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
      categoria:id_categoria ( id_categoria, nome ),
      imagem_produto ( id_imagem, url_imagem )
    `);

  if (categoria) {
    query = query.ilike('categoria.nome', `%${categoria}%`);
  }
  if (minPreco) {
    query = query.gte('preco', parseFloat(minPreco));
  }
  if (maxPreco) {
    query = query.lte('preco', parseFloat(maxPreco));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: 'success', data });
}

// POST: Criar novo produto com imagens
export async function POST(request) {
  try {
    const body = await request.json();
    const { titulo, descricao, preco, eh_doacao, id_categoria, id_profiles, urls_imagem } = body;

    // Regra de validação baseada nas constraints do SQL
    if (!titulo || !descricao || !id_categoria || !id_profiles) {
      return NextResponse.json(
        { status: 'error', message: 'Campos obrigatórios ausentes.' },
        { status: 400 }
      );
    }

    // Insert na tabela produto
    const { data: produtoCriado, error: erroProduto } = await supabase
      .from('produto')
      .insert([
        {
          titulo,
          descricao,
          preco: eh_doacao ? null : parseFloat(preco),
          eh_doacao: !!eh_doacao,
          id_categoria,
          id_profiles,
        },
      ])
      .select()
      .single();

    if (erroProduto) {
      return NextResponse.json({ status: 'error', message: erroProduto.message }, { status: 500 });
    }

    // Se houver URLs de imagem passadas, insere na tabela imagem_produto
    if (urls_imagem && Array.isArray(urls_imagem) && urls_imagem.length > 0) {
      const imagensParaInserir = urls_imagem.slice(0, 5).map((url) => ({
        id_produto: produtoCriado.id_produto,
        url_imagem: url,
      }));

      await supabase.from('imagem_produto').insert(imagensParaInserir);
    }

    return NextResponse.json({ status: 'success', data: produtoCriado }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Erro ao processar dados de inserção' },
      { status: 400 }
    );
  }
}