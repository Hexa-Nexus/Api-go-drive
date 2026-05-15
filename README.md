
# 🚗 Go Drive API

<div align="center">

![Go](https://img.shields.io/badge/Go-1.22-blue?style=for-the-badge&logo=go)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Containerization-blue?style=for-the-badge&logo=docker)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-green?style=for-the-badge)

API REST desenvolvida em Go para gerenciamento de motoristas, veículos, eventos e pagamentos.

</div>

---

# 📖 Sobre o Projeto

O **Go Drive API** é um sistema backend desenvolvido como projeto acadêmico durante o curso de Análise e Desenvolvimento de Sistemas.

O objetivo do projeto é simular um sistema real de gerenciamento de transporte, permitindo o controle de:

- Motoristas
- Veículos
- Eventos
- Pagamentos
- Autenticação de usuários

O projeto foi construído aplicando conceitos modernos de desenvolvimento backend, arquitetura em camadas e boas práticas de APIs RESTful.

---

# 👨‍💻 Equipe do Projeto

Projeto desenvolvido em grupo pelos estudantes:

- César Santos
- Josellyto Souza
- Wesley Brito
- Rafael Mato
- Gledston Ferreira

---

# 🛠️ Tecnologias Utilizadas

## Backend

- Node.js
- PostgreSQL
- JWT Authentication
- Docker
- REST API

## Ferramentas

- Git
- GitHub
- Postman
- VS Code

---

# 📂 Estrutura do Projeto

```bash
Api-go-drive/
│
├── cmd/                  # Inicialização da aplicação
├── configs/              # Configurações do sistema
├── database/             # Configuração do banco de dados
├── handlers/             # Controllers / Handlers
├── services/             # Regras de negócio
├── repositories/         # Comunicação com banco
├── routes/               # Rotas da API
├── internal/             # Estruturas internas
├── docs/                 # Documentação
└── main.go               # Arquivo principal

⚙️ Funcionalidades
🚘 Motoristas
Cadastro de motoristas
Atualização de dados
Remoção de motoristas
Listagem completa
🚗 Veículos
Cadastro de veículos
Associação com motoristas
Controle de disponibilidade
📅 Eventos
Criação de eventos
Controle de eventos ativos
Histórico de eventos
💳 Pagamentos
Registro de pagamentos
Controle financeiro
🔐 Autenticação
Login de usuários
Proteção de rotas utilizando JWT

🚀 Como Executar o Projeto
📋 Pré-requisitos

Antes de começar, você precisará ter instalado:

node.js
PostgreSQL
Git
Docker (Opcional)

🔽 Clonando o Repositório
git clone https://github.com/Hexa-Nexus/Api-go-drive.git

📁 Acessando a Pasta
cd Api-go-drive

🗄️ Configurando o Banco de Dados

Crie um banco PostgreSQL com o nome:

go_drive
🔑 Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto:

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=go_drive

JWT_SECRET=secret_key
SERVER_PORT=8080
▶️ Executando o Projeto
go run main.go

Servidor iniciado em:

http://localhost:8080
🐳 Executando com Docker
Build da aplicação
docker build -t go-drive-api .
Executando container
docker run -p 8080:8080 go-drive-api

📖 Principais Endpoints
🔐 Autenticação
Método	Endpoint	Descrição
POST	/auth/login	Realizar login
🚘 Motoristas
Método	Endpoint	Descrição
GET	/drivers	Listar motoristas
POST	/drivers	Criar motorista
PUT	/drivers/:id	Atualizar motorista
DELETE	/drivers/:id	Remover motorista
🚗 Veículos
Método	Endpoint	Descrição
GET	/cars	Listar veículos
POST	/cars	Criar veículo
📅 Eventos
Método	Endpoint	Descrição
GET	/events	Listar eventos
POST	/events	Criar evento
💳 Pagamentos
Método	Endpoint	Descrição
POST	/payments	Registrar pagamento
🧪 Testando a API

Você pode utilizar:

Postman
Insomnia
Thunder Client
🔒 Segurança

A aplicação utiliza autenticação JWT para proteção das rotas privadas.

📚 Objetivos Acadêmicos

Este projeto foi desenvolvido com finalidade acadêmica visando aplicar conceitos de:

APIs RESTful
Arquitetura em camadas
Integração com banco de dados
Autenticação JWT
Organização de projetos backend
Trabalho em equipe utilizando Git e GitHub
📈 Melhorias Futuras
 Documentação Swagger
 Testes automatizados
 Deploy em nuvem
 CI/CD
 Logs avançados
 Upload de imagens
 Monitoramento da API

🌐 Repositório

https://github.com/Hexa-Nexus/Api-go-drive
