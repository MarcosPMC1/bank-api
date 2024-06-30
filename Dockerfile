# Build e Desenvolvimento
FROM node:lts as dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT ["npm", "run"]
CMD ["start:dev"]


# Teste
FROM dev as test

COPY test ./

ENV CI=true

CMD ["npm", "run", "test"]

# Produção
FROM node:lts as prod

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main"]