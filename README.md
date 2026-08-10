# Marketplace
Desenvolvimento de um marketplace de uso Universitário focado no desapego

## Resumo da Proposta: Marketplace de Economia Circular do Campus
A proposta consiste no desenvolvimento de uma plataforma Web/Mobile (PWA) voltada para a comunidade universitária, com o objetivo de incentivar a economia circular e o desapego no campus.

## Objetivo 
Permitir que estudantes comprem, vendam ou doem materiais acadêmicos e do dia a dia (como livros, apostilas, calculadoras científicas, jalecos, componentes eletrônicos e móveis), facilitando o acesso a itens essenciais — especialmente para novos alunos.

## Arquitetura da Aplicação

### Backend (API RESTful)
Responsável por gerenciar o banco de dados (produtos, categorias, usuários e autenticação) e fornecer os dados via JSON.

## Frontend (Landing Page & PWA):
### Versão Desktop/Pública: 
Uma Landing Page de apresentação que explica a proposta do projeto, exibe estatísticas simuladas do impacto ecológico/financeiro no campus e disponibiliza uma vitrine pública com filtros de busca por categoria.

### Versão Mobile (PWA Instalável): 
Uma experiência fluida que se comporta como um aplicativo nativo no celular, permitindo que alunos autenticados publiquem anúncios (com foto, preço ou tag de doação) e gerenciem seus próprios itens cadastrados.

---

## Instruções 
### Passo a passo de como rodar a aplicação, Backend e Frontend, localmente (Pré-requisitos, comandos de instalação de dependências e comandos de execução).

## 🛠️ Pré-requisitos

Antes de iniciar, certifique-se de instalar as ferramentas necessárias de acordo com o seu sistema operacional.

### 1. Node.js e NPM
O Node.js (versão LTS recomendada) é necessário para executar a aplicação e o `npm` gerencia os pacotes.

* **Windows:**
  1. Baixe o instalador `.msi` (LTS) em [nodejs.org](https://nodejs.org/).
  2. Execute o instalador, avance as etapas e marque a opção **"Add to PATH"**.
  3. Reinicie o computador.
* **Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install -y nodejs npm
```
### Verificação: No terminal/CMD, confirme a instalação executando:

```bash
node -v
npm -v
```
### 2. Git

Utilizado para clonar e versionar o repositório do projeto.
Windows: Baixe e instale pelo site git-scm.com.
Linux: Execute sudo apt install git.
macOS: Execute brew install git.
#### Verificação: No terminal, confirme com:
```bash
git --version
```
## 🚀 Passo a Passo para Execução Local
### 1. Clonar o Repositório
Abra o terminal no diretório onde deseja armazenar o projeto e execute:
```bash
git clone <URL_DO_REPOSITORIO>
cd marketplace
```
### 2. Instalar as Dependências
Instale todas as bibliotecas e pacotes declarados no projeto (Next.js, React, Tailwind CSS, Supabase):
```bash
npm install
```
### 3. Configurar Variáveis de Ambiente (.env.local)
Crie um arquivo chamado .env.local na raiz do projeto e adicione suas credenciais do banco de dados (se aplicável):
```Snippet de código
NEXT_PUBLIC_SUPABASE_URL=[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```
### 4. Rodar a Aplicação (Frontend + Backend API)
Como o Next.js (App Router) executa o frontend e as rotas de API do backend no mesmo processo, basta rodar o servidor de desenvolvimento:
```bash
npm run dev
```
### 5. Acessar o Projeto
Abra o seu navegador web e acesse o endereço local:
👉 http://localhost:3000

## Relação de tecnologias, frameworks e bibliotecas principais adotadas.

 * Integração com Supabase: Conectamos o banco PostgreSQL (tabelas profiles, categoria, produto e imagem_produto) às rotas da API em Next.js para busca, cadastro e remoção de anúncios.
 * Interface e Estilização: Definimos o texto em preto para melhor legibilidade e criamos os cards de produto na tela inicial exibindo imagem, nome e preço com atalho para a página de detalhes.
 * Busca e Categorias: Limitamos o filtro às 5 categorias oficiais (Eletrônicos, Papelaria, Masculino Vestimenta, Feminino Vestimento e Acessórios), com suporte para agrupamento por seções e filtragem estrita.
 * Modais e Autenticação: Implementamos janelas em formato pop-up para Login/Cadastro (com validação do e-mail @edu.unifor.br e senha de 8+ dígitos) e para criação de anúncios (com opção de preço ou doação gratuita).
 * Estrutura do Projeto: Unificamos o Navbar.jsx, corrigimos conflitos de rotas do App Router e criamos uma camada de persistência local (storage.js) para funcionamento sem dependência de APIs externas.
 * Documentação: Disponibilizamos o passo a passo de instalação do ambiente (Node.js, Git, dependências) e o arquivo README.md pronto para o repositório, além da explicação técnica da arquitetura do sistema.

 ## Diário de Bordo da IA
 * Ferramentas Utilizadas: 
 - ChatGPT
 - Gemini

 * Estratégia de Engenharia de Prompts e Histórico:
 - https://share.gemini.google/CAEqjKbzsacj
 - https://chatgpt.com/share/6a7a635e-0bb0-83e9-9eb1-34cc60c8d970
 - https://chatgpt.com/share/6a7a6371-70e4-83e9-be68-f0e30a974f93
 - https://chatgpt.com/share/6a7a638f-049c-83e9-ae43-1da57c7baf62
 
 * Reflexão Crítica:
 - "Houve momentos em que o erro era indicado em outra pasta, para evitar erros ou enganos eu compartilhava o codigo na ferramenta"
 - "Eu estava evitando usar qualquer tipo de I.A. mas fiquei com a aplicação cheia de erros, me deixando nervoso e ansioso, então decidir usar pra tirar algumas dúvidas como: Conectar o Supabase"