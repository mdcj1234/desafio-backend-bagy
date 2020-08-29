# Desafio Back-end Bagy

Essa é uma aplicação NodeJS feita com JavaScript e TypeScript. É uma API com GraphQL que gerencia as requisições de um sistema de compras. O funcionamento básico da API deve gerenciar os estoques dos produtos, armazenar as ordens de compra, enviar e-mail para o cliente e gerenciar os dados em um banco de dados SQLite. 

## Tecnologias utilizadas

* Apollo-Server
* GraphQL
* SQLite3
* Tsyringe
* TypeORM
* Handlebars
* aws-sdk
* Jest

## Como instalar

Para rodar esse projeto em desenvolvimento, clone esse repositório: 

```
$ git clone https://github.com/mdcj1234/desafio-backend-bagy.git
$ cd desafio-backend-bag
$ npm install
```

Em seguida rode o comando:

```
$ npm run dev
```

## GraphQL Playground

Em ambinte de desenvolvimento, o playground do GraphQL pode ser acessado pela rota http://localhost:4000 em qualquer browser

## Variáveis de ambiente

A aplicação possui um arquivo .env na raíz do projeto que deve ser configurado à sua escolha.

![Env config](./assets/env_config.png)

## Entidades e Rotas da aplicação

### Customers

```graphql
type Query {
  customers: [Customer!]!
  customer(id: ID!): Customer!
},

type Mutation {
  createCustomer( data: CustomerInput! ): Customer
  updateCustomer( id: ID!, data: CustomerInput! ): Customer
  deleteCustomer( id: ID! ): Boolean
}
```

### Products

```graphql
type Query {
  products: [Product!]!
  product(id: ID!): Product!
},

type Mutation {
  createProduct( imageFile: Upload!, data: ProductInput! ): Product
  updateProduct( id: ID!, data: ProductInput! ): Product
  updateProductImage( id: ID!, imageFile: Upload!): Product
  deleteProduct( id: ID! ): Boolean
}
```

### Orders

```graphql
type Query {
  orders: [Order!]!
  order(id: ID!): Order!
},

type Mutation {
  createOrder(data: OrderInput!): Order
  updateOrderStatus(id: ID!): Order
  cancelOrder(id: ID!): Order
}
```
## Regras de negócio

### Orderns

* Ordens de compra tem que ter um cliente válido e produtos válidos
* A quantidade solicitada de produts na ordem de compra tem que ter em estoque.

### Produtos

* Produtos não podem ter a quantidade em estoque negativa
* Produtos têm que ter preço e peso positivos.
* Produtos tem que ter uma imagem

### Clientes

* Clientes devem ter as informações básicas preenchidas.

## Exemplo de e-mail enviado

![Email example](./assets/email_example.png)

## Configurações Docker

### Configurações recomendadas em produção

`NODE_ENV=production`
`MAIL_DRIVER=ses`
`STORAGE_DRIVER=s3`

### Como preparar o ambiente para produção

Antes de gerar uma imagem docker do projeto, coloque a varável de ambiente `NODE_ENV=production`

Faça um build do projeto

```
$ npm run build
```

Em seguinda, na raiz do projeto digite o seguinte comando

```
$ docker build -t <Nome imagem docker> .
```

Depois, para iniciar o container digite

```
$ docker run -d -p 4000:4000 <Nome imagem docker> --name <Nome do container>
```
