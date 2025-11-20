FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Expor porta
EXPOSE 3001

# Comando para rodar migrations e iniciar servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
