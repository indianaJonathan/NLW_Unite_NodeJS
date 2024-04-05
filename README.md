![nlw_logo](https://github.com/indianaJonathan/NLW_Unite_NodeJS/assets/22666576/0d7cf97d-ff13-4ca3-a5eb-37a62920ac5c)

# pass.in
O pass.in é uma aplicação de gestão de participantes em eventos presenciais.

A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição.

Os participantes inscritos podem emitir uma credencial para check-in no dia do evento.

O sistema fará um scan da credencial do participante para permitir a entrada no evento.

## Dependências
- Fastify CORS: @fastify/cors (9.0.1) *Valida as URLs que poderão realizar requisições para o backend*
- Fastify Swagger: @fastify/swagger (8.14.0) *Insere a documentação automaticamente ao projeto*
- Fastify Swagger UI: @fastify/swagger-ui (3.0.0) *Adiciona a interface do Swagger para a documentação*
- Prisma Client: @prisma/client (5.12.1) *Gerencia a conexão com a base de dados*
- Fastify: fastify (4.26.2) *Ferramenta de infraestrutura*
- Fastify Type Provider Zod: fastify-type-provider-zod (1.1.9) *Disponibiliza a validação do Zod para as rotas*
- Zod: zod (3.22.4) *Valida os dados da aplicação*

## Dependências de desenvolvimento
- Types Node: @types/node: (20.12.2) *Disponibiliza a biblioteca de tipos do Node*
- Prisma: prisma (5.11.0) *Realiza a conexão com a base de dados*
- TSUp: tsup (8.0.2) *Realiza o build do projeto para produção*
- TSX: tsx (4.7.1) *Proporciona o desenvolvimento utilizando TypeScript*
- TypeScript: typescript (5.4.3) *Define a linguagem base do projeto*

## Quick start guide

Instalar dependências do projeto:
```
npm install
```

***Você deve criar o arquivo .env na pasta principal do projeto***

Adicionar variáveis de ambiente:
```
# App
APP_PORT=<PORTA DO APLICATIVO> # Para o ambiente de desenvolvimento é recomendado o uso da porta 3333 (Padrão do node)
HOST=<ENDEREÇO DO SERVIDOR> # Para o ambiente de desenvolvimento utilize "0.0.0.0"

# Database
DATABASE_URL=<URL DE CONEXÃO COM A BASE DE DADOS> # Para o ambiente de desenvolvimento o padrão é "file:./dev.db"

# Authorized CORS
CORS_AUTHORIZED=<ENDEREÇOS AUTORIZADOS À ACESSAR ESSA APLICAÇÃO> # Para o ambiente de desenvolvimento é recomendado a liberação de todas as fontes "*"
```

Realize a migração da base de dados:
```
npm run db:migrate
```

(Opcional) Realize a inclusão dos  dados iniciais na base de dados:
```
npm run db:seed
```

## Deploy
Gerar arquivos de deploy:
```
npm run build
```

Iniciar projeto:
```
npm run start
```

## Requisitos
Requisitos funcionais

- [x] O organizador deve poder cadastrar um novo evento;
- [x] O organizador deve poder visualizar dados de um evento;
- [x] O organizador deve poder visualizar a lista de participantes;
- [x] O participante deve poder se inscrever em um evento;
- [x] O participante deve poder visualizar seu crachá de inscrição;
- [x] O participante deve poder realizar check-in no evento;

---

Regras de negócio

- [x] O participante só pode se inscrever em um evento uma única vez;
- [x] O participante só pode se inscrever em eventos com vagas disponíveis;
- [x] O participante só pode realizar check-in em um evento uma única vez;

---

Requisitos não-funcionais

- [x] O check-in no evento será realizado através de um QRCode;

## Banco de dados
Nessa aplicação vamos utilizar banco de dados relacional (SQL). Para ambiente de desenvolvimento seguiremos com o SQLite pela facilidade do ambiente.

> *Essa aplicação foi criada para melhorar as habilidades técnicas e não possui nenhum tipo de intenção comercial*
