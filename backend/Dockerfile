FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas arquivos essenciais para cache eficiente
COPY package.json package-lock.json ./

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Remove bcrypt e instala bcryptjs (implementação JS pura sem dependências binárias)
RUN npm uninstall bcrypt && npm install bcryptjs && npm install && npm prune --production

# Copia o restante do código do projeto
COPY . .

# Expõe a porta 3000 para o host
EXPOSE 3000

# Define o comando padrão para iniciar a aplicação com debugging
CMD ["sh", "-c", "ls -la && echo 'Node version:' && node --version && echo 'Starting server...' && node src/app.js"]
