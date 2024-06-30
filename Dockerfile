# Build e Desenvolvimento
FROM node:lts AS dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:dev"]

# Teste
FROM dev AS test

COPY test ./

ENV CI=true

CMD ["npm", "run", "test"]

# Produção
FROM node:lts AS prod

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main"]