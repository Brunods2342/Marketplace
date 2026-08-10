import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('produto')
    .select(`
      id_produto,
      titulo,
      descricao,
      preco,
      eh_doacao,
      data_anuncio,
      profiles:id_profiles ( nome, email ),
      categoria:id_categoria ( nome ),
      imagem_produto ( id_imagem, url_imagem )
    `)
    .eq('id_produto', id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { status: 'error', message: 'Produto não encontrado.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ status: 'success', data });
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('produto')
    .delete()
    .eq('id_produto', id)
    .select();

  if (error || !data || data.length === 0) {
    return NextResponse.json(
      { status: 'error', message: 'Falha ao deletar produto.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ status: 'success', data: data[0] });
}