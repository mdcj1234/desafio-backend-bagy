import 'dotenv/config';
import './infra/typeorm';
import 'reflect-metadata';

import '@global/container';

import { ApolloServer } from 'apollo-server';
import cors from 'cors';
import typeDefs from './infra/graphql/typeDefs';
import resolvers from './infra/graphql/resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: cors(),
  playground: process.env.NODE_ENV === 'development',
});

// eslint-disable-next-line no-console
server.listen().then(({ url }) => console.log(`Server is running in ${url}`));
