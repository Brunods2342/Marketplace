const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para garantir e interpretar requisições em JSON
app.use(express.json());

// Persistência em memória (Array de anúncios)
let anuncios = [
  {
    id: "1",
    titulo: "Smartphone XYZ",
    descricao: "Usado em ótimo estado",
    preco: 850.00,
    categoria: "eletronicos"
  }
];

// READ (Listar e Filtrar)
app.get('/api/anuncios', (req, res) => {
  const { categoria, minPreco, maxPreco } = req.query;
  let resultado = [...anuncios];

  if (categoria) {
    resultado = resultado.filter(a => a.categoria.toLowerCase() === categoria.toLowerCase());
  }
  if (minPreco) {
    resultado = resultado.filter(a => a.preco >= parseFloat(minPreco));
  }
  if (maxPreco) {
    resultado = resultado.filter(a => a.preco <= parseFloat(maxPreco));
  }

  return res.status(200).json({ status: "success", data: resultado });
});

// READ (Buscar individual por ID)
app.get('/api/anuncios/:id', (req, res) => {
  const { id } = req.params;
  const anuncio = anuncios.find(a => a.id === id);

  if (!anuncio) {
    return res.status(404).json({ status: "error", message: "Anúncio não encontrado" });
  }

  return res.status(200).json({ status: "success", data: anuncio });
});

// CREATE (Criar Anúncio)
app.post('/api/anuncios', (req, res) => {
  const { titulo, descricao, preco, categoria } = req.body;

  if (!titulo || !preco || !categoria) {
    return res.status(400).json({ 
      status: "error", 
      message: "Campos obrigatórios: titulo, preco e categoria" 
    });
  }

  const novoAnuncio = {
    id: Date.now().toString(),
    titulo,
    descricao: descricao || "",
    preco: parseFloat(preco),
    categoria
  };

  anuncios.push(novoAnuncio);
  return res.status(201).json({ status: "success", data: novoAnuncio });
});

// DELETE (Remover Anúncio)
app.delete('/api/anuncios/:id', (req, res) => {
  const { id } = req.params;
  const index = anuncios.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ status: "error", message: "Anúncio não encontrado" });
  }

  const anuncioRemovido = anuncios.splice(index, 1)[0];
  return res.status(200).json({ status: "success", data: anuncioRemovido });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});