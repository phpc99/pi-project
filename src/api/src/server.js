const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const resolvers = require("./resolvers");
const authenticate = require("./auth");

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    const user = authenticate(token.replace("Bearer ", ""));
    return { user };
  },
});

server.listen().then(({ url }) => {
  console.log(`Servidor GraphQL a correr em ${url}`);
});
