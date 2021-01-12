var express = require('express');
var router = express.Router();
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

const Prosumer = require('../system/prosumer/prosumer')
const prosumer = new Prosumer()

var prosumerSchema = buildSchema(`
    type ProsumerData {
        id: Int!
        production: Float!
        consumption: Float!
        wind: Float!
    }

    type ProsumerInfo {
        id: Int!
        name: String!
        email: String!
        role: String!
        state: String!
    }

    type StatusMsg {
        status: Boolean!
        message: String!
    }

    type AuthMsg {
        status: Boolean!
        message: String!
        tokens: Tokens
    }

    type Tokens {
        access: String!
        refresh: String!
    }

    input RegisterUserData {
        name: String!
        email: String!
        password: String!
    }

    type Query {
        prosumerData(id: Int!): ProsumerData,
        getAllProsumer: [ProsumerInfo]
    }

    input BufferRatio {
        buy: Float,
        sell: Float
    }

    type BufferRatioMessage {
        id: Int!,
        buy: Float,
        sell: Float
    }

    type Mutation {
        register(input: RegisterUserData): Boolean!
        authenticate(email: String!, password: String!): AuthMsg
        setBufferRatio(id: Int!, input: BufferRatio): StatusMsg
    }
    `);

var prosumerRoot = {
    prosumerData: (args) => {
        return prosumer.getData(args.id)
    },
    getAllProsumer: () => {
        return prosumer.getAllProsumer()
    },
    register: (args) => {
        return prosumer.registerProsumer(args)
    },
    authenticate: (args) => {
        return prosumer.authenticate(args.email, args.password)
    },
    setBufferRatio: (args) => {
        return prosumer.setBufferRatio(args.id, args.input)
    }
  }

router
  .use('/', graphqlHTTP({
  schema: prosumerSchema,
  rootValue: prosumerRoot,
  graphiql: true,
}));

module.exports = router;