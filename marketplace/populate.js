import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Carrega as variáveis do arquivo .env

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use ANON_KEY no frontend ou SERVICE_ROLE_KEY no backend/scripts de carga
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 

export const supabase = createClient(supabaseUrl, supabaseKey);
// Mapeamento para as categorias da sua tabela 'categoria'
const MAPA_CATEGORIAS = {
  "electronics": "Eletrônicos",
  "jewelery": "Acessórios",
  "men's clothing": "Masculino Vestimenta",
  "women's clothing": "Feminino Vestimento"
};

// Termos em inglês para gerar imagens extras no Unsplash conforme a categoria
const KEYWORDS_UNSPLASH = {
  "electronics": ["gadget", "technology", "tech-device"],
  "jewelery": ["jewelry", "accessory", "luxury-watch"],
  "men's clothing": ["menswear", "fashion-male", "clothing"],
  "women's clothing": ["womenswear", "fashion-female", "outfit"]
};

// Função para gerar URLs de imagens adicionais variadas
function gerarImagensExtras(categoriaApi, quantidade = 3) {
  const keywords = KEYWORDS_UNSPLASH[categoriaApi] || ["product"];
  const imagens = [];

  for (let i = 0; i < quantidade; i++) {
    const kw = keywords[i % keywords.length];
    // Adiciona um parâmetro 'sig' aleatório para evitar imagens repetidas da mesma URL
    const randomSig = Math.floor(Math.random() * 10000);
    imagens.push(`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80&sig=${randomSig}&kw=${kw}`);
  }

  return imagens;
}

async function popularBancoComImagens() {
  console.log('🚀 Iniciando população de Produtos e Imagens...');

  // 1. Garante perfil padrão (@edu.unifor.br)
  let { data: profile } = await supabase
    .from('profiles')
    .select('id_profiles')
    .eq('email', 'aluno@edu.unifor.br')
    .maybeSingle();

  if (!profile) {
    const { data: newProfile, error: errCreateUser } = await supabase
      .from('profiles')
      .insert([{
        nome: 'Aluno Unifor',
        email: 'aluno@edu.unifor.br',
        senha: 'senha123456'
      }])
      .select('id_profiles')
      .single();

    if (errCreateUser) {
      console.error('❌ Erro ao criar perfil padrão:', errCreateUser.message);
      return;
    }
    profile = newProfile;
  }

  // 2. Busca categorias do banco
  const { data: categorias } = await supabase.from('categoria').select('id_categoria, nome');
  const mapaCategoriasDb = Object.fromEntries(categorias.map(c => [c.nome, c.id_categoria]));

  // 3. Consome os 20 produtos da FakeStoreAPI
  console.log('📡 Buscando dados da FakeStoreAPI...');
  const res = await fetch('https://fakestoreapi.com/products');
  const produtosApi = await res.json();

  console.log(`📦 Processando ${produtosApi.length} produtos...`);

  // 4. Inserção de Produtos + Galeria de Imagens
  for (const prod of produtosApi) {
    const nomeCategoriaDb = MAPA_CATEGORIAS[prod.category] || 'Eletrônicos';
    const idCategoria = mapaCategoriasDb[nomeCategoriaDb];

    // Inserir Produto
    const { data: prodInserido, error: errProd } = await supabase
      .from('produto')
      .insert([{
        id_profiles: profile.id_profiles,
        id_categoria: idCategoria,
        titulo: prod.title.substring(0, 100),
        descricao: prod.description,
        preco: prod.price,
        eh_doacao: false
      }])
      .select('id_produto')
      .single();

    if (errProd) {
      console.error(`❌ Erro ao inserir produto "${prod.title}":`, errProd.message);
      continue;
    }

    const idProduto = prodInserido.id_produto;

    // Monta a lista de URLs de imagens (1 principal da API + 3 extras geradas)
    const listaImagens = [];
    
    // Imagem 1: Imagem principal do produto que veio na API
    if (prod.image) {
      listaImagens.push(prod.image);
    }

    // Imagens 2, 3 e 4: Imagens extras complementares (respeita o limite < 5 do banco)
    const imagensExtras = gerarImagensExtras(prod.category, 3);
    listaImagens.push(...imagensExtras);

    // Formata o array para realizar o insert de uma só vez no banco
    const payloadImagens = listaImagens.map(url => ({
      id_produto: idProduto,
      url_imagem: url
    }));

    // Inserir todas as imagens cadastradas para este produto
    const { error: errImg } = await supabase
      .from('imagem_produto')
      .insert(payloadImagens);

    if (errImg) {
      console.error(`⚠️ Erro ao inserir imagens do produto ID ${idProduto}:`, errImg.message);
    } else {
      console.log(`✅ Produto "${prod.title.substring(0, 30)}..." inserido com ${payloadImagens.length} imagens.`);
    }
  }

  console.log('✨ Todos os 20 produtos foram cadastrados com suas respectivas imagens!');
}

popularBancoComImagens();