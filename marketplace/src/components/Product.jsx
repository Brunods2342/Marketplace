import Link from 'next/link';

export default function Product({ produto }) {
  // Pega a primeira imagem cadastrada ou usa um placeholder genérico caso não tenha
  const primeiraImagem = produto.imagem_produto?.[0]?.url_imagem || 'https://via.placeholder.com/300x200?text=Sem+Imagem';

  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
      {/* Imagem do Produto */}
      <div className="relative h-48 w-full bg-gray-100">
        <img
          src={primeiraImagem}
          alt={produto.titulo}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Conteúdo compacto (Nome e Preço) */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-base font-bold text-gray-800 line-clamp-1 mb-1">
            {produto.titulo}
          </h3>
          
          <div className="text-lg font-extrabold text-emerald-600">
            {produto.eh_doacao ? (
              <span className="text-blue-600 font-semibold text-sm">Doação Gratúita</span>
            ) : (
              `R$ ${Number(produto.preco).toFixed(2)}`
            )}
          </div>
        </div>

        {/* Botão e Link para a Tela Individual */}
        <Link
          href={`/produtos/${produto.id_produto}`}
          className="mt-4 block text-center w-full bg-blue-600 text-white font-medium text-sm py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}