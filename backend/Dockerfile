FROM node:22

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas arquivos essenciais para cache eficiente
COPY package.json package-lock.json ./

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Instala apenas dependências necessárias para produção
RUN npm install --omit=dev

# Copia o restante do código do projeto
COPY . .

# Expõe a porta 3000 para o host
EXPOSE 3000

# Define o comando padrão para iniciar a aplicação
CMD ["node", "src/app.js"]
