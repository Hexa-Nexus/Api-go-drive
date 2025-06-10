# API Go Drive - Backend

Esta é a API backend para o serviço Go Drive, uma plataforma de aluguel de veículos.

## Tecnologias

- Node.js
- Express
- Prisma ORM
- MySQL
- JWT para autenticação
- Jest para testes

## Pré-requisitos

- Node.js 16 ou superior
- MySQL Database
- npm ou yarn

## Instalação

1. Clone o repositório
2. Instale as dependências

```bash
cd backend
npm install
```

3. Configure as variáveis de ambiente em um arquivo `.env`

```
DATABASE_URL="mysql://user:password@localhost:3306/godrive"
JWT_SECRET="sua_chave_secreta_para_jwt"
```

4. Execute as migrações do Prisma

```bash
npm run migrate
```

5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/        # Controladores da aplicação
│   ├── middlewares/        # Middlewares (autenticação, etc)
│   ├── prisma/             # Configuração e esquema do Prisma
│   │   └── schema.prisma   # Definição do esquema do banco de dados
│   ├── routes/             # Rotas da API
│   ├── docs/               # Documentação da API (Swagger)
│   └── app.js              # Arquivo principal da aplicação
├── __tests__/              # Testes automatizados
└── package.json            # Dependências e scripts
```

## Testes

O projeto inclui testes unitários e de integração usando Jest.

### Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes com watch mode (útil durante o desenvolvimento)
npm run test:watch

# Executar testes e gerar relatório de cobertura
npm run test:coverage
```

### Diretórios de Teste

- `src/__tests__/unit/`: Testes unitários para componentes isolados
- `src/__tests__/integration/`: Testes de integração para rotas e fluxos completos
- `src/__tests__/helpers/`: Funções auxiliares para testes

Para mais detalhes sobre os testes, consulte [src/__tests__/README.md](src/__tests__/README.md).

## API Endpoints

A API está documentada com Swagger e pode ser acessada em:

```
http://localhost:3000/api-docs
```

### Principais Endpoints

- **Autenticação**
  - `POST /api/gestores/login`: Login de gestor

- **Gestores**
  - `POST /api/gestores`: Criar novo gestor
  - `GET /api/gestores`: Listar gestores
  - `GET /api/gestores/:id`: Obter gestor por ID

- **Carros**
  - `POST /api/carros`: Adicionar novo carro
  - `GET /api/carros`: Listar carros
  - `GET /api/carros/:id`: Obter carro por ID
  - `PUT /api/carros/:id`: Atualizar carro
  - `DELETE /api/carros/:id`: Remover carro

- **Motoristas**
  - `POST /api/motoristas`: Adicionar novo motorista
  - `GET /api/motoristas`: Listar motoristas
  - `GET /api/motoristas/:id`: Obter motorista por ID

- **Eventos**
  - `POST /api/eventos`: Criar novo evento
  - `GET /api/eventos`: Listar eventos
  - `GET /api/eventos/:id`: Obter evento por ID

- **Pagamentos**
  - `POST /api/pagamentos`: Registrar pagamento
  - `GET /api/pagamentos`: Listar pagamentos

## Licença

Este projeto está licenciado sob a licença ISC.
