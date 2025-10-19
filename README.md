# 🔧 Repositório de Integração e DevOps - Dynamic Dashboard Generation Platform

## 📌 Responsável
**Matheus** - Gestão de repositórios e integração.

## 📋 Descrição
Este repositório atua como **hub central** do projeto, contendo:
- Gestão e integração dos 3 repositórios (`dashboard-db`, `dashboard-api`, `dashboard-frontend`).
- Documentação e instruções para rodar o projeto.
- Scripts auxiliares para setup e integração.

## 📝 Tarefas Principais
- Gerir os 3 repositórios Git.
- Integrar commits dos colegas de forma manual e organizada.
- Testar a compatibilidade entre os módulos.
- Criar documentação técnica.

## 📆 Entregas Esperadas
| Data limite  | Tarefa  |
|-------------|--------|
| **15 de março**  | Configuração inicial e integração básica |
| **30 de maio**  | Otimização final e preparação para entrega |

## 🛠️ Como Trabalhar Neste Repositório
1. Atualizar regularmente com as versões finais dos outros repositórios.
2. Garantir que todas as partes do código estão compatíveis.
3. Documentar o processo de integração.

## Comandos para Rodar a Aplicação

1. Abrir 3 terminais wsl
2. No primeiro terminal usar o comando: cd src/api/src, para acessar o path descrito e rodar o comando: node server.js
3. No segundo terminal usar o comando: cd src/api/src, para acessar o path descrito e rodar o comando: node uploadServer.js
4. No terceiro terminal usar o comando: cd src/frontend/my-app, para acessar o path descrito e rodar o comando: npm run dev
5. Após executar os passos anteriores clique no link de localhost do terminal de frontend.
6. Se o npm não funcionar tente usar npm install.

# Features

- Developed a web-based platform that enables users to create and manage customizable dashboards dynamically;
- Implemented user authentication (registration, login, logout) with JWT-based security, ensuring private dashboards and data isolation;
- Supported dashboard creation, editing, and deletion, with real-time updates and responsive layout management;
- Enabled widget management, allowing users to add, remove, resize, and reposition visual or textual elements interactively;
- Integrated CSV file upload for importing data and transforming it into visual insights;
- Implemented data visualization widgets using D3.js, supporting bar and pie charts with automatic mapping of CSV data fields;
- Designed a three-tier architecture (frontend, backend, and database) for scalability and maintainability;
- Developed an independent Express server for handling file uploads, converting CSV data into JSON for visualization;
- Utilized Apollo Server and GraphQL API to manage dashboards, widgets, and data sources efficiently;
- Created a responsive and intuitive frontend using React, React Router, and Apollo Client for seamless user interaction;
- Modeled and implemented a relational database in SQLite, supporting entities like users, widgets, data sources, and layouts;
- Conducted API validation and testing through Apollo Sandbox, ensuring correctness of queries, mutations, and database persistence;
- Adopted an iterative Agile development process, with weekly sprints, code versioning in GitLab, and collaboration via Discord;
- Ensured scalability and future extensibility, with support planned for real-time data sources, new chart types, and advanced dashboard interactivity.

# Authors

- Hugo Miguel Lopes da Cruz
- Matheus Negrini Liotti
- Pedro Henrique Pessôa Camargo
- Tomas dos Santos Nunes Loureiro Esteves
