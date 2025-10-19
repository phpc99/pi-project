# 📊 Repositório de Base de Dados - Dynamic Dashboard Generation Platform

## 📌 Responsável
**Pedro** - Gestão e implementação da base de dados.

## 📋 Descrição
Este repositório contém a estrutura da base de dados do projeto, incluindo:
- Modelação e conceção do esquema.
- Scripts de migração e inicialização.
- Regras de integridade e otimização.

## 📝 Tarefas Principais
- Criar o esquema inicial da base de dados.
- Implementar scripts para migração e carga de dados.
- Otimizar consultas e garantir a integridade dos dados.

## 📆 Entregas Esperadas
| Data limite  | Tarefa  |
|-------------|--------|
| **1 de março**  | Estrutura inicial da base de dados pronta |
| **15 de março**  | Implementação das relações e otimizações |

## 🛠️ Como Trabalhar Neste Repositório
1. Criar branch para cada alteração (`feature/nome-da-tarefa`).
2. Submeter _merge requests_ para revisão antes de integrar no `main`.
3. Testar todas as queries antes de commit.

# 🖥️ Como Correr a Base de Dados (Windows)
1. Entre em ambiente WSL;
2. Escreva no terminal ```sqlite3``` (pode instalar com o comando ```sudo apt install sqlite3```);
3. ```.read create.sql``` para ler o ficheiro de criação de tabelas;
4. ```.read populate.sql``` para ler o ficheiro de inserção de dados;
5. Caso queira, corra ```.mode columns``` e ```.headers on``` para melhor visualização das tabelas;
6. A partir de agora, pode correr os comandos do sql para visualização dos dados.