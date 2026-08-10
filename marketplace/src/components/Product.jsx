import Link from 'next/link';

export default function Product({ produto }) {
  const primeiraImagem = produto.imagem_produto?.[0]?.url_imagem || 'https://via.placeholder.com/300x200?text=Sem+Imagem';
  
  // Trata o nome da categoria vindo da relação do Supabase
  const nomeCategoria = typeof produto.categoria === 'object' 
    ? produto.categoria?.nome 
    : produto.categoria;

  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between text-black">
      <div className="relative h-48 w-full bg-gray-100">
        <img
          src={primeiraImagem}
          alt={produto.titulo}
          className="w-full h-full object-cover"
        />
        {/* Etiqueta de Categoria no Card */}
        {nomeCategoria && (
          <span className="absolute top-2 left-2 bg-black/75 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
            {nomeCategoria}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-base font-bold text-black line-clamp-1 mb-1">
            {produto.titulo}
          </h3>
          
          <div className="text-lg font-extrabold text-emerald-600">
            {produto.eh_doacao ? (
              <span className="text-blue-600 font-semibold text-sm">Doação Gratuita</span>
            ) : (
              `R$ ${Number(produto.preco).toFixed(2)}`
            )}
          </div>
        </div>

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