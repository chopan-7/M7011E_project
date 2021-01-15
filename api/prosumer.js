var express = require('express');
var router = express.Router();
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const {verifyToken, unsignToken} = require('./validate');

const Prosumer = require('../system/prosumer/prosumer')
const prosumer = new Prosumer()

var prosumerSchema = buildSchema(`
    type ProsumerData {
        id: Int!
        production: Float!
        consumption: Float!
        buffer: Float!
        buy_ratio: Float!
        sell_ratio: Float!
        wind: Float!
    }

    type ProsumerInfo {
        id: Int!
        name: String!
        email: String!
        role: String!
        state: String!
        online: Boolean!
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

    input inputTokens {
        access: String
        refress: String
    }

    input RegisterUserData {
        name: String!
        email: String!
        password: String!
        picture: String
    }

    type Query {
        prosumerData(id: Int!, input: inputTokens): ProsumerData,
        getAllProsumer(input: inputTokens): [ProsumerInfo]
        getProsumerInfo(id: Int!, input: inputTokens): ProsumerInfo
    }

    input BufferRatio {
        buy: Float,
        sell: Float,
        token: String!
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
        signOut(input: inputTokens): AuthMsg
    }
    `);

var prosumerRoot = {
    prosumerData: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified) {
            return prosumer.getData(args.id)
        }
    },
    getAllProsumer: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified){
            return prosumer.getAllProsumer()
        }
    },
    getProsumerInfo: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified) {
            return prosumer.getProsumerInfo(args.id)
        }
    },
    register: (args) => {
        return prosumer.registerProsumer(args)
    },
    authenticate: (args) => {
        return prosumer.authenticate(args.email, args.password)
    },
    signOut: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified) {
            // signOut user from db
            prosumer.signOut(getToken.data.id)
            return ({
                status: true,
                message: 'Bye',
                tokens: unsignToken(args.input.access)
            })
        }
    },
    setBufferRatio: (args) => {
        const getToken = verifyToken(args.input.token)
        if(getToken.verified && args.id === getToken.data.id) {
            return prosumer.setBufferRatio(args.id, args.input)
        }
    }
  }


router
  .use('/', graphqlHTTP(async (req) => ({
  schema: prosumerSchema,
  rootValue: prosumerRoot,
  graphiql: true,
  context: () => context(req)
})));

module.exports = router;