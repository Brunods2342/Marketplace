// Singleton simples para garantir que a memória persista entre requisições
const globalForAnuncios = global;

if (!globalForAnuncios.anuncios) {
  globalForAnuncios.anuncios = [
    {
      id: "1",
      titulo: "Smartphone XYZ",
      descricao: "Usado em ótimo estado",
      preco: 850.00,
      categoria: "eletronicos"
    }
  ];
}

export const anuncios = globalForAnuncios.anuncios;