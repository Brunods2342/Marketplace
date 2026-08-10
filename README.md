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

## Instruções 
## Usuarios do Sistema
- Alunos

## Requisitos Funcionais
Referem-se às funcionalidades que o sistema deve executar.

- RF01 - O sistema deve disponibilizar uma API REST para gerenciamento de anúncios.
- RF02 - A API deve permitir criar anúncios.
- RF03 - A API deve permitir listar anúncios.
- RF04 - A API deve permitir filtrar anúncios.
- RF05 - A API deve permitir excluir anúncios.
- RF06 - O sistema deve persistir os dados dos anúncios durante a execução da aplicação.
- RF07 - A API deve receber e retornar dados no formato JSON.
- RF08 - O sistema deve permitir autenticação de usuários (bônus).
- RF09 - O sistema deve validar os campos obrigatórios das requisições (bônus).
- RF10 - O sistema deve tratar erros de forma adequada, retornando respostas apropriadas (bônus).
- RF11 - O sistema deve disponibilizar uma interface web para interação com a API.
- RF12 - O sistema deve permitir a instalação da aplicação como PWA.
- RF13 - O sistema deve adaptar sua interface para dispositivos móveis (responsividade).
- RF14 - O sistema deve permitir a visualização offline de dados previamente carregados (bônus).

## Requisitos Não Funcionais
Referem-se às características técnicas e de qualidade do sistema.

- RNF01 - O backend deve ser desenvolvido utilizando uma linguagem ou framework compatível com APIs REST (Node.js, FastAPI, Java Spring Boot, C#, etc.).
- RNF02 - O frontend deve ser desenvolvido utilizando tecnologias web modernas (React, Vue.js, Angular ou HTML/CSS/JavaScript).
- RNF03 - O sistema deve utilizar um mecanismo de persistência de dados (SQLite, banco em memória ou banco de dados).
- RNF04 - A comunicação entre cliente e servidor deve utilizar exclusivamente o formato JSON.
- RNF05 - A aplicação deve possuir um arquivo manifest.json válido para PWA.
- RNF06 - A aplicação deve possuir um Service Worker básico.
- RNF07 - A interface deve ser totalmente responsiva para desktop e dispositivos móveis.
- RNF08 - O sistema pode utilizar um banco de dados relacional ou não relacional em container ou na nuvem (ex.: PostgreSQL ou MongoDB) como diferencial.
- RNF09 - O frontend pode ser desenvolvido utilizando TypeScript como diferencial.
- RNF10 - A interface deve apresentar componentes visuais modernos, feedback de carregamento e transições suaves.