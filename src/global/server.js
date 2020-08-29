import 'dotenv/config';
import 'reflect-metadata';

import './container';
import './infra/typeorm';

import { ApolloServer } from 'apollo-server';

import typeDefs from './infra/graphql/typeDefs';
import resolvers from './infra/graphql/resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: false,
  playground: process.env.NODE_ENV === 'development',
});

// eslint-disable-next-line no-console
server.listen().then(({ url }) => console.log(`Server is running in ${url}`));
