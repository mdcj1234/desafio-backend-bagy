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
$ npm run test
```

## Variáveis de ambiente

A aplicação possui um arquivo .env na raíz do projeto que deve ser configurado à sua escolha.

![Env config](./assets/env_config.png)

## Entidades

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


