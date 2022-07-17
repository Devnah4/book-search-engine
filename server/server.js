const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');
const { ApolloServer } = require('apollo-server-express')

// imports typeDef and resolvers
const { typeDefs, resolvers } = require('./schemas');
// exports the server here
const db = require('./config/connection');
// imports authentication utility
const { authMiddleware } = require('./utils/auth');
const PORT = process.env.PORT || 3001;

// sets up appoloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})

const app =express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// creates new ApolloServer with graphQL schema info
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
});

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
