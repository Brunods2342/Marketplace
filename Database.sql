-- 0. Habilita a extensão para geração de UUIDs (padrão do PostgreSQL/Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabela de Usuários (profiles)
CREATE TABLE profiles (
    id_profiles UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, 

    -- Validação: E-mail deve terminar obrigatoriamente com @edu.unifor.br
    CONSTRAINT chk_email_unifor CHECK (email LIKE '%@edu.unifor.br'),
    
    -- Validação: Mínimo de 8 caracteres na senha
    CONSTRAINT chk_senha_min_length CHECK (LENGTH(senha) >= 8)
);

-- 2. Tabela de Categorias
CREATE TABLE categoria (
    id_categoria UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Tabela de Produtos
CREATE TABLE produto (
    id_produto UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_profiles UUID NOT NULL,
    id_categoria UUID NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10, 2), -- Nulo caso seja doação
    eh_doacao BOOLEAN NOT NULL DEFAULT FALSE,
    data_anuncio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Relacionamentos (Chaves Estrangeiras)
    CONSTRAINT fk_produto_profiles FOREIGN KEY (id_profiles) 
        REFERENCES profiles(id_profiles) ON DELETE CASCADE,
        
    CONSTRAINT fk_produto_categoria FOREIGN KEY (id_categoria) 
        REFERENCES categoria(id_categoria),

    -- Regra de Negócio: Se for doação, preço pode ser nulo. Se NÃO for doação, preço é obrigatório.
    CONSTRAINT chk_preco_ou_doacao CHECK (
        (eh_doacao = TRUE AND preco IS NULL) OR 
        (eh_doacao = FALSE AND preco IS NOT NULL AND preco >= 0)
    )
);

-- 4. Tabela de Imagens dos Produtos (Suporta de 1 a 5 URLs por produto)
CREATE TABLE imagem_produto (
    id_imagem UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_produto UUID NOT NULL,
    url_imagem TEXT NOT NULL,
    
    CONSTRAINT fk_imagem_produto FOREIGN KEY (id_produto) 
        REFERENCES produto(id_produto) ON DELETE CASCADE
);

-- 5. Trigger/Função para garantir o limite máximo de 5 imagens por produto
CREATE OR REPLACE FUNCTION verificar_limite_imagens()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM imagem_produto WHERE id_produto = NEW.id_produto) >= 5 THEN
        RAISE EXCEPTION 'Um produto não pode ter mais de 5 imagens cadastradas.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_limite_imagens
BEFORE INSERT ON imagem_produto
FOR EACH ROW
EXECUTE FUNCTION verificar_limite_imagens();

-- 6. Inserção das Categorias Obrigatórias
INSERT INTO categoria (nome) 
VALUES ('Itens de Laboratorio'), ('Eletrônicos'), ('Papelaria'), ('Masculino Vestimenta'), ('Feminino Vestimento'), ('Acessórios')
ON CONFLICT (nome) DO NOTHING;