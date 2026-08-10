import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Carrega as variáveis do arquivo .env

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use ANON_KEY no frontend ou SERVICE_ROLE_KEY no backend/scripts de carga
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 

export const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'produtos';

const MAPA_CATEGORIAS = {
  "electronics": "Eletrônicos",
  "jewelery": "Acessórios",
  "men's clothing": "Masculino Vestimenta",
  "women's clothing": "Feminino Vestimento"
};

// Função para baixar a imagem da API e subir para o Bucket do Supabase
async function uploadImagemParaBucket(urlImagemOriginal, nomeArquivo) {
  try {
    // 1. Baixa a imagem como Blob/Buffer
    const response = await fetch(urlImagemOriginal);
    if (!response.ok) throw new Error('Falha ao baixar imagem original');
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // 2. Envia para o Bucket do Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(nomeArquivo, buffer, {
        contentType: contentType,
        upsert: true // Sobrescreve se já existir um arquivo com o mesmo nome
      });

    if (error) {
      console.error(`❌ Erro no Upload do Storage (${nomeArquivo}):`, error.message);
      return null;
    }

    // 3. Obtém a URL pública gerada para a imagem dentro do Bucket
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(nomeArquivo);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error(`❌ Erro ao processar upload da imagem:`, err.message);
    return null;
  }
}

async function popularComBucket() {
  console.log('🚀 Iniciando processo de download e upload para o Storage...');

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

    if (errCreateUser) return console.error('❌ Erro no usuário:', errCreateUser.message);
    profile = newProfile;
  }

  // 2. Mapeia categorias do banco
  const { data: categorias } = await supabase.from('categoria').select('id_categoria, nome');
  const mapaCategoriasDb = Object.fromEntries(categorias.map(c => [c.nome, c.id_categoria]));

  // 3. Busca produtos da API
  const res = await fetch('https://fakestoreapi.com/products');
  const produtosApi = await res.json();

  console.log(`📦 Processando ${produtosApi.length} produtos...`);

  for (const prod of produtosApi) {
    const nomeCategoriaDb = MAPA_CATEGORIAS[prod.category] || 'Eletrônicos';
    const idCategoria = mapaCategoriasDb[nomeCategoriaDb];

    // Inserir Produto no Banco
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

    // Processamento e Upload da Imagem para o Storage
    if (prod.image) {
      // Define um nome único para a imagem dentro do Bucket (ex: produto_1_1690000.jpg)
      const extensao = prod.image.split('.').pop().split('?')[0] || 'jpg';
      const nomeArquivoStorage = `produto_${prodInserido.id_produto}.${extensao}`;

      // Envia para o Bucket e obtém a nova URL hospedada no Supabase
      const urlBucketPublica = await uploadImagemParaBucket(prod.image, nomeArquivoStorage);

      if (urlBucketPublica) {
        // Salva no banco de dados a URL definitiva do Bucket
        await supabase.from('imagem_produto').insert([{
          id_produto: prodInserido.id_produto,
          url_imagem: urlBucketPublica
        }]);

        console.log(`✅ Produto "${prod.title.substring(0, 25)}..." salvo com imagem do Storage!`);
      }
    }
  }

  console.log('✨ Todos os produtos e imagens foram salvos no Supabase Storage com sucesso!');
}

popularComBucket();