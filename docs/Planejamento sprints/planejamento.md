# Planejamento SCRUM — Healthy Challenge Web

## Visão Geral do Projeto

O projeto **Healthy Challenge Web** consiste em uma plataforma web voltada para incentivo de hábitos saudáveis por meio de mecanismos de gamificação, desafios diários e interação social entre usuários. O sistema busca estimular a constância em atividades físicas, alimentação saudável e desenvolvimento cognitivo através de recompensas, progressão de ligas e mini-jogos interativos.

A aplicação foi desenvolvida utilizando arquitetura cliente-servidor, separando responsabilidades entre frontend e backend, permitindo maior escalabilidade, manutenção e modularização do sistema. O backend é responsável pela lógica de negócio, autenticação, persistência de dados e gerenciamento das regras de gamificação, enquanto o frontend fornece uma interface interativa e responsiva para os usuários.

O desenvolvimento do projeto segue metodologias ágeis baseadas em SCRUM, utilizando sprints incrementais para permitir evolução contínua das funcionalidades, validação progressiva do sistema e integração constante entre desenvolvimento e testes.

---

# Informações do Projeto

* **Metodologia:** SCRUM
* **Modelo de Desenvolvimento:** Incremental e Iterativo
* **Controle de Versão:** Git e GitHub
* **Repositório:**
  https://github.com/AlunoKevin/Healthy-Challenge-Web/tree/main

---

# Cronograma Geral das Sprints

| Sprint   | Período                 | Duração | Objetivo Principal                        |
| -------- | ----------------------- | ------- | ----------------------------------------- |
| Sprint 0 | 13/05/2026 — 19/05/2026 | 7 dias  | Levantamento de requisitos e planejamento |
| Sprint 1 | 20/05/2026 — 03/06/2026 | 15 dias | Estrutura inicial e autenticação          |
| Sprint 2 | 04/06/2026 — 18/06/2026 | 15 dias | Sistema de desafios e gamificação         |
| Sprint 3 | 19/06/2026 — 03/07/2026 | 15 dias | Funcionalidades sociais e mini-jogos      |
| Sprint 4 | 04/07/2026 — 18/07/2026 | 15 dias | Finalização, testes e deploy              |

---

# Organização SCRUM

## Product Backlog

O Product Backlog será composto pelas funcionalidades principais da plataforma, organizadas conforme prioridade de desenvolvimento e dependências técnicas.

### Principais itens do backlog

* Sistema de autenticação;
* Cadastro e gerenciamento de usuários;
* Sistema de desafios;
* Sistema de pontuação;
* Evolução de ligas;
* Rankings;
* Sistema social;
* Mini-jogos cognitivos;
* Testes automatizados;
* Deploy da aplicação.

---

# Sprint 0 — Levantamento de Requisitos e Planejamento Inicial

## Período

**13/05/2026 — 19/05/2026**

## Objetivo Principal

Realizar a análise inicial do sistema, levantamento de requisitos e definição da arquitetura base da aplicação.

## Desenvolvimento

Nesta etapa inicial foi realizado o levantamento dos requisitos funcionais e não funcionais da plataforma, identificando as principais funcionalidades necessárias para o funcionamento do sistema de desafios saudáveis e gamificação.

Também foram definidos:

* objetivos gerais da aplicação;
* perfil dos usuários da plataforma;
* regras iniciais de negócio;
* modelagem preliminar do banco de dados;
* organização da arquitetura cliente-servidor;
* definição das tecnologias utilizadas no frontend e backend;
* estruturação inicial do repositório e versionamento com Git.

Além disso, foram produzidas as documentações iniciais do projeto, incluindo planejamento das sprints, descrição da proposta da aplicação e organização das tarefas de desenvolvimento.

## Entregas da Sprint

* Levantamento de requisitos;
* Modelagem inicial do banco de dados;
* Estruturação do repositório;
* Planejamento arquitetural;
* Documentação inicial do projeto.

---

# Sprint 1 — Estrutura Base e Sistema de Autenticação

## Período

**20/05/2026 — 03/06/2026**

## Objetivo Principal

Implementar a infraestrutura inicial da aplicação e desenvolver o sistema de autenticação de usuários.

## Desenvolvimento

Nesta sprint será desenvolvida a estrutura principal do sistema, incluindo configuração do ambiente de desenvolvimento, integração entre frontend e backend e conexão com o banco de dados PostgreSQL.

Serão implementadas funcionalidades relacionadas ao gerenciamento de usuários, incluindo:

* cadastro de usuários;
* autenticação via login;
* gerenciamento básico de sessões;
* persistência segura de credenciais;
* criação das entidades fundamentais do sistema.

Também serão definidas as rotas principais da API REST, organização das camadas de serviço e padronização da comunicação entre cliente e servidor.

A arquitetura será organizada visando modularidade e manutenção futura, separando componentes visuais, regras de negócio e acesso a dados.

## Testes

Os testes serão desenvolvidos simultaneamente às funcionalidades utilizando a metodologia TDD (*Test-Driven Development*), garantindo validação contínua da autenticação, persistência de dados e regras de acesso do sistema.

## Cerimônias SCRUM

* Sprint Planning;
* Daily Scrum;
* Sprint Review;
* Sprint Retrospective.

## Entregas da Sprint

* Estrutura inicial do frontend e backend;
* Integração com PostgreSQL;
* Sistema de cadastro e login;
* Criação das entidades principais;
* Estrutura inicial da API;
* Testes unitários iniciais.

---

# Sprint 2 — Sistema de Desafios e Gamificação

## Período

**04/06/2026 — 18/06/2026**

## Objetivo Principal

Implementar a lógica principal de gamificação da plataforma.

## Desenvolvimento

Nesta sprint serão desenvolvidos os mecanismos centrais responsáveis pela experiência gamificada do usuário dentro da plataforma.

Serão implementados:

* sistema de desafios diários e semanais;
* pontuação baseada em atividades concluídas;
* progresso individual do usuário;
* sistema de experiência e evolução;
* divisão de usuários em ligas;
* armazenamento do histórico de progresso.

As regras de negócio relacionadas à progressão serão implementadas no backend, garantindo integridade das informações e consistência da pontuação dos usuários.

Também serão adicionadas funcionalidades de acompanhamento visual do progresso no frontend, permitindo melhor interação e engajamento dos usuários.

## Testes

A abordagem TDD continuará sendo aplicada durante o desenvolvimento, incluindo testes unitários e de integração voltados para:

* validação da lógica de pontuação;
* persistência de progresso;
* regras de evolução entre ligas;
* integridade dos desafios.

## Cerimônias SCRUM

* Sprint Planning;
* Daily Scrum;
* Sprint Review;
* Sprint Retrospective.

## Entregas da Sprint

* Sistema de desafios;
* Sistema de pontuação;
* Evolução de usuários;
* Ligas competitivas;
* Histórico de progresso;
* Testes de regras de negócio.

---

# Sprint 3 — Funcionalidades Sociais e Mini-jogos

## Período

**19/06/2026 — 03/07/2026**

## Objetivo Principal

Desenvolver funcionalidades sociais e recursos interativos da plataforma.

## Desenvolvimento

Esta sprint será focada na criação de funcionalidades voltadas para interação entre usuários e aumento do engajamento da plataforma.

Serão implementados:

* sistema de amizade entre usuários;
* rankings globais e locais;
* sistema de comparação de desempenho;
* mini-jogos cognitivos;
* desafios interativos baseados em memória visual;
* melhorias na interface e experiência do usuário.

Os mini-jogos serão desenvolvidos visando estimular capacidades cognitivas enquanto mantêm relação com a proposta de hábitos saudáveis e evolução pessoal da plataforma.

Também serão realizados refinamentos visuais na interface, buscando melhorar acessibilidade, responsividade e usabilidade da aplicação.

## Testes

Os testes validarão:

* funcionamento dos rankings;
* sincronização de pontuações;
* interações sociais;
* mecânicas dos mini-jogos;
* estabilidade da comunicação cliente-servidor.

## Cerimônias SCRUM

* Sprint Planning;
* Daily Scrum;
* Sprint Review;
* Sprint Retrospective.

## Entregas da Sprint

* Sistema de amigos;
* Rankings globais;
* Mini-jogos cognitivos;
* Melhorias de interface;
* Ajustes de usabilidade;
* Testes de integração social.

---

# Sprint 4 — Finalização, Otimização e Deploy

## Período

**04/07/2026 — 18/07/2026**

## Objetivo Principal

Estabilizar o sistema e preparar a entrega final da aplicação.

## Desenvolvimento

Nesta sprint serão realizados processos de refinamento e estabilização da plataforma, focando em desempenho, segurança e experiência do usuário.

As atividades incluem:

* correção de bugs;
* otimização de consultas ao banco de dados;
* melhorias de desempenho no frontend;
* refinamentos visuais finais;
* revisão completa da documentação;
* preparação do ambiente de produção;
* deploy da aplicação web.

Também serão realizadas validações finais da arquitetura e revisão da organização do código visando facilitar manutenção futura e evolução do sistema.

## Testes

Além dos testes já implementados ao longo do desenvolvimento utilizando TDD, serão executados:

* testes finais de integração;
* testes de usabilidade;
* testes de estabilidade;
* validações de responsividade;
* testes de desempenho e carga.

## Cerimônias SCRUM

* Sprint Planning;
* Daily Scrum;
* Sprint Review;
* Sprint Retrospective.

## Entregas da Sprint

* Sistema estabilizado;
* Correções finais;
* Deploy da aplicação;
* Documentação final;
* Testes completos do sistema;
* Versão final do projeto.

---

# Definição de Pronto (Definition of Done)

Uma funcionalidade será considerada concluída quando:

* estiver implementada;
* possuir testes unitários e/ou de integração;
* estiver integrada ao frontend e backend;
* estiver documentada;
* não apresentar falhas críticas;
* estiver aprovada durante a Sprint Review.

---

# Tecnologias Utilizadas

## Frontend

* HTML5;
* CSS3;
* JavaScript;
* React.

## Backend

* Node.js;
* Express.js;
* PostgreSQL.

## Ferramentas

* Git;
* GitHub;
* Docker;
* Postman;
* Jest;
* VS Code.

---

# Considerações Finais

A utilização da metodologia SCRUM permite maior controle sobre o desenvolvimento do projeto, possibilitando entregas incrementais, validação contínua das funcionalidades e rápida adaptação a mudanças de requisitos.

A divisão em sprints contribui para organização do fluxo de desenvolvimento, acompanhamento da evolução do sistema e garantia da qualidade do produto final.
