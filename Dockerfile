# Use a imagem oficial do Node.js como base
FROM node:16-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código do projeto para o diretório de trabalho
COPY . .

# Gere o Prisma Client
RUN npx prisma generate

# Compile o projeto TypeScript
RUN npm run build

# Exponha a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "start:prod"]