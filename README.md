
# 🏦Bank-API

Uma API para criação de contas, pagamento e relátorios de pagamentos enviados, possui o controle de concorrencia para pagamentos, controle de saldo das contas e upload de imagem para associar a pagamentos. O upload das imagens são feitas na AWS S3 Bucket.



## Features

- Cadastrar usuario do sistema
- Login com JWT Token
- Crair contas (apenas usuarios autenticados)
- Realizar transferência para outras contas
- Gerar relatorio de transferências realizadas por um periodo
- Upload de imagem para associar a um pagamento


## Tech Stack

**Database:**: PostgreSQL

**API**: NestJS

**Container**: Docker & Docker-Compose