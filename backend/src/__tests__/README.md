# Testes da API Go Drive

Este diretório contém testes automatizados para a API Go Drive, organizados de forma a facilitar a manutenção e compreensão.

## Estrutura dos Testes

```
__tests__/
├── helpers/               # Funções auxiliares compartilhadas entre testes
│   ├── auth.helper.js     # Funções para testes relacionados à autenticação
│   └── mock-data.helper.js # Dados mock compartilhados entre os testes
│
├── unit/                  # Testes unitários (testam componentes isolados)
│   ├── controllers/       # Testes para os controllers
│   │   ├── carroController.test.js
│   │   ├── eventoController.test.js
│   │   ├── motoristaController.test.js
│   │   ├── pagamentoController.test.js
│   │   └── gestorController.test.js
│   ├── middlewares/
│   │   └── auth.test.js
│   └── app.test.js        # Testes para a configuração da aplicação
│
├── integration/           # Testes de integração (testam a interação entre componentes)
│   ├── api.test.js        # Teste da configuração geral da API
│   └── routes/
│       ├── carroRoutes.test.js
│       ├── motoristaRoutes.test.js
│       ├── pagamentoRoutes.test.js
│       ├── gestorRoutes.test.js
│       └── eventoRoutes.test.js
│
├── env.test.js            # Testes para as variáveis de ambiente
└── README.md              # Este arquivo
```

## Como Executar os Testes

Para executar todos os testes:

```bash
npm test
```

Para executar testes com watch mode (ótimo durante o desenvolvimento):

```bash
npm run test:watch
```

Para executar testes com coverage report:

```bash
npm run test:coverage
```

Para executar um arquivo de teste específico:

```bash
npm test -- src/__tests__/unit/controllers/carroController.test.js
```

## Mocks

Utilizamos jest.mock para simular:

1. Conexão com o banco de dados (Prisma)
2. Autenticação e geração de tokens JWT
3. Criptografia de senhas (bcrypt)
4. Requisições HTTP em testes de integração (supertest)

Isto nos permite testar a lógica dos controllers e rotas sem depender de um banco de dados real ou serviços externos.

## Helpers de Teste

### auth.helper.js
Contém funções para gerar tokens JWT mock e headers de autorização para os testes.

### mock-data.helper.js
Contém objetos mock para entidades como Gestor, Carro, Motorista, Evento e Pagamento que são utilizados em vários testes.

## Categorias de Testes

### Testes Unitários
Testam componentes isolados da aplicação, como controllers e middlewares. Os principais controllers cobertos são:
- CarroController - gerencia operações de veículos
- GestorController - gerencia autenticação e usuários administradores
- MotoristaController - gerencia motoristas
- PagamentoController - gerencia pagamentos
- EventoController - gerencia eventos de locação (saída e entrada de veículos)

### Testes de Integração
Testam a interação entre componentes, como as rotas HTTP e os controllers. Cobrimos todas as rotas principais:
- Gestor (autenticação, CRUD)
- Carro (CRUD)
- Motorista (CRUD)
- Evento (CRUD)
- Pagamento (CRUD)

### Testes de Ambiente
Verificam se as variáveis de ambiente são devidamente configuradas (como JWT_SECRET e DATABASE_URL).

## Cobertura de Testes

A cobertura de testes atualmente inclui:

- **Controllers**: Todos os métodos dos principais controllers
- **Middlewares**: Verificação de autenticação
- **Rotas**: Todas as rotas da API
- **Configuração da aplicação**: Verificação da estrutura principal do app

## Como Adicionar Novos Testes

1. Identifique o componente a ser testado.
2. Escolha o diretório apropriado (unit/ ou integration/).
3. Crie um arquivo .test.js seguindo a convenção de nomenclatura.
4. Importe os módulos necessários e os mocks apropriados.
5. Escreva testes que cubram os casos de sucesso e erro.

## Boas Práticas

- Separe claramente as seções Arrange, Act e Assert (AAA) em seus testes
- Use mocks para isolar o código que está sendo testado
- Evite dependências externas nos testes unitários
- Cubra casos de erro e validações, não apenas o caminho feliz
